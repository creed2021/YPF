sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem"
], (Controller, MessageToast, MessageBox, SelectDialog, StandardListItem) => {
    "use strict";

    return Controller.extend("ypf.ypfui5hrsaldo.controller.View1", {
        onInit() {
        },
        onCabeceraValidacion: function () {
            var oWizard = this.byId("wizardId");
            var oStep1 = this.byId("PrimerStep");

            var bCompleto =
                !!this.byId("inpSociedad").getValue().trim() &&
                !!this.byId("cmbTipoSolicitud").getSelectedKey() &&
                !!this.byId("inpProveedor").getValue().trim() &&
                !!this.byId("cmbUbicacion").getSelectedKey();

            if (bCompleto) {
                oWizard.validateStep(oStep1);
            } else {
                oWizard.invalidateStep(oStep1);
            }

        },
        onValueHelpSociedad: function () {
            var aSociedades = [
                { key: "0620", text: "0620" },
                { key: "1000", text: "1000" },
                { key: "2000", text: "2000" }
            ];

            if (!this._oSociedadDialog) {
                this._oSociedadDialog = new SelectDialog({
                    title: "Seleccionar Sociedad",
                    items: aSociedades.map(function (oItem) {
                        return new StandardListItem({
                            title: oItem.key,
                            description: oItem.text
                        });
                    }),
                    confirm: function (oEvent) {
                        var oSelectedItem = oEvent.getParameter("selectedItem");
                        if (oSelectedItem) {
                            this.byId("inpSociedad").setValue(oSelectedItem.getTitle());
                            this._checkStep1Completion();
                        }
                    }.bind(this),
                    cancel: function () { }
                });

                this.getView().addDependent(this._oSociedadDialog);
            }

            this._oSociedadDialog.open();
        },

        onValueHelpProveedor: function () {
            var aProveedores = [
                { key: "3389209764", text: "3389209764 - Proveedor Demo 1" },
                { key: "4455667788", text: "4455667788 - Proveedor Demo 2" },
                { key: "1122334455", text: "1122334455 - Proveedor Demo 3" }
            ];

            if (!this._oProveedorDialog) {
                this._oProveedorDialog = new SelectDialog({
                    title: "Seleccionar Proveedor",
                    items: aProveedores.map(function (oItem) {
                        return new StandardListItem({
                            title: oItem.key,
                            description: oItem.text
                        });
                    }),
                    confirm: function (oEvent) {
                        var oSelectedItem = oEvent.getParameter("selectedItem");
                        if (oSelectedItem) {
                            this.byId("inpProveedor").setValue(oSelectedItem.getTitle());
                            this._checkStep1Completion();
                        }
                    }.bind(this),
                    cancel: function () { }
                });

                this.getView().addDependent(this._oProveedorDialog);
            }

            this._oProveedorDialog.open();
        }
    });
});