<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                        {{ $t("IMathAS.p3") }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Reader",
    data() {
        return {
            loading: false,
            error: false,
            errorMessage: ""
        };
    },
    methods: {
        handleDrop: function (e) {
            console.log('Handling Drop')
            let component = this;
            try {
                e.stopPropagation();
                e.preventDefault();
                this.loading = true;
                //this.cancelError();
                var files = e.dataTransfer.files,
                    f = files[0],
                    csv;
                let type = f.name.split(".").pop();
                if (!type.match(/csv/i)) throw "loadError";
                var reader = new FileReader();
                reader.onload = e => {
                    try {
                        // 1. Getting file
                        csv = e.target.result;
                        this.handleData(csv);
                    } catch (er) {
                        if (er == "loadError") component.handleLoadError();
                    }
                };
                reader.readAsText(f);
            } catch (er) {
                if (er == "loadError") component.handleLoadError();
            }
        },
        handleData(csv) {
            this.$emit('dataRead', csv)
        },
        handleDragover(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
        }
    }
}
</script>

<style>
#drop {
  border: 2px dashed #bbb;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold, "Vollkorn";
  color: #bbb;
}
</style>