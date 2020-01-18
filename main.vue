<script>
export default {
  data: function() {
    return {
      logs: {},
      chatLogs: {},
      chatName: "Insert Username",
      chatComment: "Insert Comment",
      userkey: "",
      timeStamp: "",
      tryCount: [0, 0, 0, 0, 0],
      unitCode: "",
      questions: [1, 2, 3, 4, 5],
      translateFrom: "python",
      translateTo: "java",
      showDiscussionArea: false,
      showHints: false,
      originUrl: "",
      currentTask: 1,
      output: "",
      text: "",
      firebaseUrl: "https://codetranslate-2019.firebaseio.com/"
    };
  },
  methods: {
    postContents: async function() {
      // comment: leaving the gatewayUrl empty - API will post back to itself
      const gatewayUrl =
        "https://0nlvhj3sia.execute-api.us-east-1.amazonaws.com/default/findCompile";
      let content = "";
      let answer = "";
      if (this.translateTo === "java") {
        content = this.layoutItems[this.currentTask - 1].contentjava;
        answer = this.layoutItems[this.currentTask - 1].solutionjava;
      } else {
        content = this.layoutItems[this.currentTask - 1].contentpython;
        answer = this.layoutItems[this.currentTask - 1].solutionpython;
      }
      await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ shown: { 0: answer }, editable: { 0: content } , hidden: { 0: {dialogCode:this.layoutItems[this.currentTask - 1].hiddenCode, type:this.translateTo} } })
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.answer = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.output = data.textFeedback;
          return this.toggleQuestionStatus(data);
        });
    },
    toggleQuestionStatus(data) {
      this.tryCount[this.currentTask - 1]++;
      if (data.textFeedback) {
        const searchText = data.textFeedback;
        if (searchText.includes("You got the answer")) {
          this.correct[this.currentTask] = true;
          this.log_event({ event: "correct", question: this.currentTask });
        } else {
          this.correct[this.currentTask] = false;
          this.log_event({ event: "incorrect", question: this.currentTask });
        }
      }
    },
    getUnit() {
      this.unitCode = this.$route.params.code;
    },
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/java");
      require("brace/mode/python");
      require("brace/theme/chrome");
      require("brace/snippets/javascript"); //snippet
    },
    openDiscussionArea() {
      this.showDiscussionArea = true;
    },
    closeDiscussionArea() {
      this.showDiscussionArea = false;
    },
    toggleHints() {
      this.showHints = !this.showHints;
    },
    isComplete: function(task) {
      return this.correct[task];
    },
    fetch_logs: async function() {
      let response = await fetch(this.firebaseUrl + "/logs.json");
      let data = await response.json();
      this.logs = data;
    },
    fetch_chat_logs: async function() {
      let response = await fetch(
        this.firebaseUrl + "/chat.json"
      );
      let data = await response.json();
      this.chatLogs = data;
    },
    reset() {
      this.correct[this.currentTask] = false;
      this.output=""
      if (this.translateTo === "java") {
        this.layoutItems[
          this.currentTask - 1
        ].contentjava = this.defaultLayoutItems[
          this.currentTask - 1
        ].contentjava;
      } else {
        this.layoutItems[
          this.currentTask - 1
        ].contentpython = this.defaultLayoutItems[
          this.currentTask - 1
        ].contentpython;
      }
      this.tryCount[this.currentTask - 1] = 0;
    },
    insert_chat: function() {
      if (
        //do not insert rubbish comment
        !this.chatComment.includes("Comment")
      ) {
        this.insert_chat_event({
          name: this.chatName,
          comment: this.chatComment,
          time: this.timeStamp
        });
        this.chatName = "Insert Username";
        this.chatComment = "Insert Comment";
      }
    },
    insert_chat_event: function(event) {
      console.log("Logging event.");
      fetch(this.firebaseUrl + "/chat.json", {
        method: "post",
        body: JSON.stringify(event)
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("Logged event", data);
        });
    },
    log_event: function(event) {
      console.log("Logging event.");
      fetch(this.firebaseUrl + "/logs.json", {
        method: "post",
        body: JSON.stringify(event)
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("Logged event", data);
        });
    },
    save_progress: async function() {
      if (this.translateTo === "java") {
        console.log("Saving progress.");
        let progressUrl =
          this.firebaseUrl + "/progress/" + this.userkey + ".json";
        let response = await fetch(progressUrl, {
          method: "put",
          body: JSON.stringify({
            contentjava: this.layoutItems[this.currentTask - 1].contentjava,
            correct: this.correct
          })
        });
        let result = await response.json();
        console.log(result);
      } else {
        console.log("Saving progress.");
        let progressUrl =
          this.firebaseUrl + "/progress/" + this.userkey + ".json";
        let response = await fetch(progressUrl, {
          method: "put",
          body: JSON.stringify({
            contentpython: this.layoutItems[this.currentTask - 1].contentpython,
            correct: this.correct
          })
        });
        let result = await response.json();
        console.log(result);
      }
    },
    restore_progress: async function() {
      let progressUrl =
        this.firebaseUrl + "/progress/" + this.userkey + ".json";
      let response = await fetch(progressUrl);
      let data = await response.json();
      this.layoutItems[this.currentTask - 1].contentjava = data.contentjava;
      this.layoutItems[this.currentTask - 1].contentpython = data.contentpython;
      this.correct = data.correct;
    },
    getNow: function() {
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + " " + time;
      this.timeStamp = dateTime;
    }
  },
  created() {
    this.getUnit();
    setInterval(this.getNow, 1000);
  },
  mounted: function() {
    this.$nextTick(function() {
      window.setInterval(() => {
        this.fetch_chat_logs();
      }, 1000);
    });
  }
};
</script>