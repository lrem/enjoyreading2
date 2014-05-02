const widgets = require("sdk/widget");
const tabs = require("sdk/tabs");
const { Hotkey } = require("sdk/hotkeys");
var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var notifications = require("sdk/notifications");

var onClick = function() {
  worker = tabs.activeTab.attach({
      contentScriptFile: [
        data.url("underscore.js"),
        data.url("readability.js"),
        data.url('resources.js')
      ]
    });

  worker.port.emit("click", {
    css: data.url('readability.css'),
    storage: {
      size: ss.storage.size,
      margin: ss.storage.margin,
      style: ss.storage.style
    }
  });

  worker.port.on("ready", function(){
    worker.port.emit("init");
  });

  worker.port.on('style', function(opts){
    ss.storage[opts.rule] = opts.value ;
  });
};

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: data.url("figures/logo.ico"),
  contentScriptWhen: "ready",
  hotkey: Hotkey({
    combo: "control-alt-r",
    onPress: onClick
  }),
  onClick: onClick
});
