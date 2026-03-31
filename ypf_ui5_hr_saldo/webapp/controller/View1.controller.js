sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem"
], function (Controller, MessageToast, MessageBox, SelectDialog, StandardListItem) {
    "use strict";

    return Controller.extend("ypf.ypfui5hrsaldo.controller.View1", {
        onInit: function () {
            var oWizard = this.byId("wizSolicitud");
            oWizard.setShowNextButton(false);
        },

        onCabeceraValidacion: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepCabecera = this.byId("stpCabecera");

            var bCompleto =
                !!this.byId("inpSociedad").getValue().trim() &&
                !!this.byId("cmbTipoSolicitud").getSelectedKey() &&
                !!this.byId("inpProveedor").getValue().trim() &&
                !!this.byId("cmbUbicacion").getSelectedKey();

            if (bCompleto) {
                oWizard.validateStep(oStepCabecera);
            } else {
                oWizard.invalidateStep(oStepCabecera);
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
                            this.onCabeceraValidacion();
                        }
                    }.bind(this),
                    cancel: function () {}
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
                            this.onCabeceraValidacion();
                        }
                    }.bind(this),
                    cancel: function () {}
                });

                this.getView().addDependent(this._oProveedorDialog);
            }

            this._oProveedorDialog.open();
        },

        onSiguientePaso1: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepCabecera = this.byId("stpCabecera");

            this.onCabeceraValidacion();

            if (oStepCabecera.getValidated()) {
                oWizard.nextStep();
            }
        },

        onPasoAnterior1: function () {
            var oWizard = this.byId("wizSolicitud");
            oWizard.previousStep();
        },

        onInformacionValidacion: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepInformacion = this.byId("stpInformacion");

            var bCompleto =
                !!this.byId("inpSucursal").getValue().trim() &&
                !!this.byId("inpPedido").getValue().trim() &&
                !!this.byId("inpHojaEntrada").getValue().trim() &&
                !!this.byId("inpCentroCosto").getValue().trim() &&
                !!this.byId("inpEjercicio").getValue().trim() &&
                !!this.byId("cmbMoneda").getSelectedKey() &&
                !!this.byId("inpImporte").getValue().trim();

            if (bCompleto) {
                oWizard.validateStep(oStepInformacion);
            } else {
                oWizard.invalidateStep(oStepInformacion);
            }
        },

        onSiguientePaso2: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepInformacion = this.byId("stpInformacion");

            this.onInformacionValidacion();

            if (oStepInformacion.getValidated()) {
                oWizard.nextStep();
            }
        },

        onCancelarSolicitud: function () {
            MessageBox.warning(
                "Se perderá la información completada si cancela la solicitud",
                {
                    title: "¿Cancelar la solicitud?",
                    actions: ["Si, cancelar solicitud", "No, quiero continuar"],
                    emphasizedAction: "Si, cancelar solicitud",
                    onClose: function (sAction) {
                        if (sAction === "Si, cancelar solicitud") {
                            MessageToast.show("Solicitud cancelada");

                            var oWizard = this.byId("wizSolicitud");
                            this._resetFormulario();
                            oWizard.discardProgress(oWizard.getSteps()[0]);
                        }
                    }.bind(this)
                }
            );
        },

        onValueHelpPedido: function (oEvent) {
            var oInput = oEvent.getSource();

            var oDialog = new SelectDialog({
                title: "Seleccionar Pedido",
                items: [
                    new StandardListItem({ title: "4500000010", description: "Pedido Materiales" }),
                    new StandardListItem({ title: "4500000020", description: "Pedido Servicios" }),
                    new StandardListItem({ title: "4500000030", description: "Pedido Mantenimiento" })
                ],
                confirm: function (oEvt) {
                    var oItem = oEvt.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }.bind(this)
            });

            oDialog.open();
        },

        onValueHelpCentroCosto: function (oEvent) {
            var oInput = oEvent.getSource();

            var oDialog = new SelectDialog({
                title: "Seleccionar Centro de Costo",
                items: [
                    new StandardListItem({ title: "CC1000", description: "Administración" }),
                    new StandardListItem({ title: "CC2000", description: "Operaciones" }),
                    new StandardListItem({ title: "CC3000", description: "Mantenimiento" })
                ],
                confirm: function (oEvt) {
                    var oItem = oEvt.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }.bind(this)
            });

            oDialog.open();
        },

        onValueHelpCentroBeneficio: function (oEvent) {
            var oInput = oEvent.getSource();

            var oDialog = new SelectDialog({
                title: "Seleccionar Centro de Beneficio",
                items: [
                    new StandardListItem({ title: "CB1000", description: "Refinación" }),
                    new StandardListItem({ title: "CB2000", description: "Distribución" }),
                    new StandardListItem({ title: "CB3000", description: "Comercialización" })
                ],
                confirm: function (oEvt) {
                    var oItem = oEvt.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }.bind(this)
            });

            oDialog.open();
        },

        _resetFormulario: function () {
            var oWizard = this.byId("wizSolicitud");

            this.byId("inpSociedad").setValue("");
            this.byId("inpProveedor").setValue("");

            this.byId("cmbTipoSolicitud").setSelectedKey("");
            this.byId("cmbUbicacion").setSelectedKey("");

            this.byId("inpSucursal").setValue("1101");
            this.byId("inpPedido").setValue("");
            this.byId("inpHojaEntrada").setValue("");
            this.byId("inpCentroCosto").setValue("");
            this.byId("inpEjercicio").setValue("");
            this.byId("inpImporte").setValue("");
            this.byId("inpReferencia").setValue("");
            this.byId("inpCentroBeneficio").setValue("");

            this.byId("cmbMoneda").setSelectedKey("");
            this.byId("txtaComentario").setValue("");

            oWizard.discardProgress(oWizard.getSteps()[0]);

            oWizard.invalidateStep(this.byId("stpCabecera"));
            oWizard.invalidateStep(this.byId("stpInformacion"));
            oWizard.invalidateStep(this.byId("stpComentarios"));
        },

        onComentariosValidacion: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepComentarios = this.byId("stpComentarios");

            var bCompleto = !!this.byId("txtaComentario").getValue().trim();

            if (bCompleto) {
                oWizard.validateStep(oStepComentarios);
            } else {
                oWizard.invalidateStep(oStepComentarios);
            }
        },

        onPasoAnterior2: function () {
            var oWizard = this.byId("wizSolicitud");
            oWizard.previousStep();
        },

        onSiguientePaso3: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepComentarios = this.byId("stpComentarios");

            this.onComentariosValidacion();

            if (oStepComentarios.getValidated()) {
                oWizard.nextStep();
            }
        }
    });
});