// Mixin for handling errors in the reader
const ReaderErrors = {
    data() {
      return {
        errorMessage: ""
      };
    },
    methods: {
      handleProcessError: function (error) {
        {
          this.$root.$data.Error=error;
          this.loading = false;
          this.$router.push({ name: "Problem" })
        }
      },
      cancelError: function () {
        this.Error.type = this.lineArray.length ? "loaded" : "empty";
        this.errorMessage = "";
      },
      sendMail: function () {
        var mail = document.createElement("a");
        mail.href =
          "mailto:dahn@dahn-research.eu?subject=Testanalyzer:%20Problem%20mit%20" +
          this.system;
        mail.click();
        this.error = "none";
      },
      handleLoadError: function () {
        {
          this.loading = false;
          this.Error.type = "loadError";
          return;
        }
      }
    }
  };
  
  export default ReaderErrors