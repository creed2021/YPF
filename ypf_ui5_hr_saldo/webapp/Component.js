sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "ypf/ypfui5hrsaldo/model/models"
], (UIComponent,JSONModel, models) => {
    "use strict";

    return UIComponent.extend("ypf.ypfui5hrsaldo.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

             // Modelo local para adjuntos
            this.setModel(new JSONModel({
                items: []
            }), "filesLocal");

            // enable routing
            this.getRouter().initialize();
        }
    });
});