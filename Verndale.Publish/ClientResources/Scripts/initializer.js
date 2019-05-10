define([
    'dojo/_base/declare',
    "epi/dependency",
    "publish/PublishToolbarProvider"
], function(declare, dependency, PublishToolbarProvider) {
    return declare(null, {
        initialize: function () {
            console.log("Start module Publish");

            var commandregistry = dependency.resolve("epi.globalcommandregistry");
            //The first parameter is the "area" that your provider should add commands to
            //For the global toolbar the area is "epi.cms.globalToolbar"
            commandregistry.registerProvider("epi.cms.globalToolbar", new PublishToolbarProvider());
        }
    });
});
