<template>
  <div class="prefixCls" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }" />
  </div>
</template>

<script setup>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/hr";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace";
// import "tinymce/plugins/spellchecker";
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/template";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/table";
import "tinymce/plugins/image";

import {
  computed,
  nextTick,
  ref,
  unref,
  watch,
  onDeactivated,
  onBeforeUnmount,
  defineProps,
  defineEmits,
  getCurrentInstance,
} from "vue";
import { toolbar, plugins } from "./tinymce";
import { bindHandlers } from "./helper";
import {
  isNumber,
  buildShortUUID,
  onMountedOrActivated,
} from "@/utils/tinymce";
import axios from "axios";
import store from "@/store";

const axiosUrl =
  (process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api") +
  "/upload";
const imgUrl =
  process.env.VUE_APP_BASE_IMG_URL || "http://localhost:3000/uploads/";
const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + store.state.user.token,
  },
};

const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  },
  value: {
    type: String,
  },

  toolbar: {
    type: Array,
    default: toolbar,
  },
  plugins: {
    type: Array,
    default: plugins,
  },
  modelValue: {
    type: String,
  },
  height: {
    type: [Number, String],
    required: false,
    default: 400,
  },
  width: {
    type: [Number, String],
    required: false,
    default: "auto",
  },
  showImageUpload: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits([
  "change",
  "update:modelValue",
  "inited",
  "init-error",
]);
const { attrs } = getCurrentInstance();
const tinymceId = ref(buildShortUUID("tiny-vue"));
const containerWidth = computed(() => {
  const width = props.width;
  if (isNumber(width)) {
    return `${width}px`;
  }
  return width;
});
const editorRef = ref(null);
const fullscreen = ref(false);
const elRef = ref(null);
const tinymceContent = computed(() => props.modelValue);

const initOptions = computed(() => {
  const { height, options, toolbar, plugins } = props;
  const publicPath = "/";
  return {
    selector: `#${unref(tinymceId)}`,
    height,
    toolbar,
    menubar: "file edit insert view format table",
    plugins,
    language_url: "/tinymce/langs/zh_CN.js",
    language: "zh_CN",
    branding: false,
    default_link_target: "_blank",
    link_title: false,
    object_resizing: false,
    auto_focus: true,
    skin: "oxide",
    skin_url: "/tinymce/skins/ui/oxide",
    content_css: "/tinymce/skins/ui/oxide/content.min.css",
    ...options,
    setup: (editor) => {
      editorRef.value = editor;
      editor.on("init", (e) => initSetup(e));
    },
    // images_upload_url:
    //   (process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api") +
    //   "/upload",
    // images_upload_base_path:
    //   process.env.VUE_APP_BASE_IMG_URL || "http://localhost:3000/uploads/",
    images_upload_handler: (blobInfo, success, failure) => {
      if (blobInfo.blob().size / 1024 / 1024 > 2) {
        failure("上传失败，图片大小请控制在 2M 以内");
      } else {
        let params = new FormData();
        params.append("file", blobInfo.blob());
        axios
          .post(axiosUrl, params, config)
          .then((res) => {
            if (res.data && res.data.location) {
              success(imgUrl + res.data.location);
            } else {
              failure("上传失败");
            }
          })
          .catch(() => {
            failure("上传出错，网络问题");
          });
      }
    },
    file_picker_types: "media",
    file_picker_callback: (cb, value, meta) => {
      //当点击media图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
      if (["media", "file"].includes(meta.filetype)) {
        //创建一个隐藏的type=file的文件选择input
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.onchange = function () {
          let file = this.files[0]; //只选取第一个文件。如果要选取全部，后面注意做修改
          let formData;
          formData = new FormData();
          formData.append("file", file);
          axios
            .post(axiosUrl, formData, config)
            .then((res) => {
              if (res.data && res.data.location) {
                cb(imgUrl + res.data.location);
              }
            })
            .catch(() => {
              console.log("上传出错，网络问题");
            });
        };
        //触发点击
        input.click();
      }
    },
  };
});

const disabled = computed(() => {
  const { options } = props;
  const getdDisabled = options && Reflect.get(options, "readonly");
  const editor = unref(editorRef);
  if (editor) {
    editor.setMode(getdDisabled ? "readonly" : "design");
  }
  return getdDisabled ?? false;
});

watch(
  () => attrs.disabled,
  () => {
    const editor = unref(editorRef);
    if (!editor) {
      return;
    }
    editor.setMode(attrs.disabled ? "readonly" : "design");
  }
);

onMountedOrActivated(() => {
  if (!initOptions.value.inline) {
    tinymceId.value = buildShortUUID("tiny-vue");
  }
  nextTick(() => {
    setTimeout(() => {
      initEditor();
    }, 30);
  });
});

onBeforeUnmount(() => {
  destory();
});

onDeactivated(() => {
  destory();
});

function destory() {
  if (tinymce !== null) {
    // tinymce?.remove?.(unref(initOptions).selector!);
  }
}

function initSetup(e) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const value = props.modelValue || "";

  editor.setContent(value);
  bindModelHandlers(editor);
  bindHandlers(e, attrs, unref(editorRef));
}

function initEditor() {
  const el = unref(elRef);
  if (el) {
    el.style.visibility = "";
  }
  tinymce
    .init(unref(initOptions))
    .then((editor) => {
      emits("inited", editor);
    })
    .catch((err) => {
      emits("init-error", err);
    });
}

function setValue(editor, val, prevVal) {
  if (
    editor &&
    typeof val === "string" &&
    val !== prevVal &&
    val !== editor.getContent({ format: attrs.outputFormat })
  ) {
    editor.setContent(val);
  }
}

function bindModelHandlers(editor) {
  const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
  const normalizedEvents = Array.isArray(modelEvents)
    ? modelEvents.join(" ")
    : modelEvents;

  watch(
    () => props.modelValue,
    (val, prevVal) => {
      setValue(editor, val, prevVal);
    }
  );

  watch(
    () => props.value,
    (val, prevVal) => {
      setValue(editor, val, prevVal);
    },
    {
      immediate: true,
    }
  );

  editor.on(normalizedEvents || "change keyup undo redo", () => {
    const content = editor.getContent({ format: attrs.outputFormat });
    emits("update:modelValue", content);
    emits("change", content);
  });

  editor.on("FullscreenStateChanged", (e) => {
    fullscreen.value = e.state;
  });
}

function handleImageUploading(name) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  editor.execCommand("mceInsertContent", false, getUploadingImgName(name));
  const content = editor?.getContent() ?? "";
  setValue(editor, content);
}

function handleDone(name, url) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const content = editor?.getContent() ?? "";
  const val =
    content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? "";
  setValue(editor, val);
}

function getUploadingImgName(name) {
  return `[uploading:${name}]`;
}
</script>

<style lang="less" scoped>
.prefixCls {
  position: relative;
  line-height: normal;
}
textarea {
  z-index: -1;
  visibility: hidden;
}
</style>
