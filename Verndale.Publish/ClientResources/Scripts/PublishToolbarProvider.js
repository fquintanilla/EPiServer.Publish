define([
    "dojo/_base/declare",
    "dijit/form/Button",

    "epi-cms/component/command/_GlobalToolbarCommandProvider",
    "publish/PublishCommand"
], function (declare, Button, _GlobalToolbarCommandProvider, PublishCommand) {
    return declare([_GlobalToolbarCommandProvider], {
        constructor: function () {
            this.inherited(arguments);
            this.addToTrailing(new PublishCommand({
            }), { showLabel: true, id: "PublishCommand", widget: Button });
        }
    });
});
