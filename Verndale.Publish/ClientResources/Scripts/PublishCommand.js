define([
        "dojo/_base/declare",
        "dojo/_base/connect", // To be able to subscribe to events using Dojo's pub/sub model
        "dijit/registry", // Used to look up added dijits
        "epi/shell/command/_Command",
        "epi/shell/widget/dialog/Confirmation"
    ],
    function(declare, connect, registry, _Command, Confirmation) {

        return declare([_Command],
            {
                name: "Publish",
                label: "Publish current page and sub pages",
                tooltip: "Publish with sub items",
                iconClass: "epi-iconPublished", //Define your own icon css class here.
                canExecute: true,

                constructor: function() {
                    // Subscribe to event to respond to whenever the editor navigates to
                    // another piece of content in edit mode, or when the content changes
                    connect.subscribe("/epi/shell/context/changed", this._contextChanged);
                },

                _contextChanged: function(context, caller) {
                    var button = registry.byId('PublishCommand');
                    if (button) {
                        button.set('label', "Publish '" + context.name + "' page and sub pages");
                    }
                },

                _execute: function () {
                    var contextService = epi.dependency.resolve("epi.shell.ContextService");
                    var currentContext = contextService.currentContext;
                    var button = registry.byId('PublishCommand');

                    var dialog = new Confirmation({
                        heading: "Publish Page",
                        description: "Are you sure you want to publish the '" + currentContext.name + "' page and sub pages?",
                        onAction: function (confirmed) {
                            if (confirmed) {
                                button.set('label', "Publishing " + currentContext.name + " pages ...");
                                button.set('disabled', true);

                                var request = $.ajax({
                                    url: '/VerndalePublish/Index',
                                    type: "POST",
                                    data: { id: currentContext.id },
                                    dataType: "json",
                                    success: function (result) {
                                        var contextParameters = { uri: 'epi.cms.contentdata:///' + result };
                                        dojo.publish("/epi/shell/context/request", [contextParameters]);

                                        button.set('label', "Publish '" + currentContext.name + "' page and sub pages");
                                        button.setDisabled(false);
                                    },
                                    error: function (jqXHR, textStatus) {
                                        alert('An error occured, unable to retrieve data from Capifast: ' + textStatus);
                                        button.set('label', "Error...");
                                        button.setDisabled(false);
                                    }
                                });
                            }
                        }
                    });
                    dialog.show();
                }
            });
    });
