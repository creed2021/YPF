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
            var oWizard = this.byId("wizardId");
            oWizard.setShowNextButton(false);
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
                            this.onCabeceraValidacion();
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
                            this.onCabeceraValidacion();
                        }
                    }.bind(this),
                    cancel: function () { }
                });

                this.getView().addDependent(this._oProveedorDialog);
            }

            this._oProveedorDialog.open();
        },
        onSiguientePaso1: function () {
            var oWizard = this.byId("wizardId");
            var oStepActual = this.byId("PrimerStep");

            this.onCabeceraValidacion();

            if (oStepActual.getValidated()) {
                oWizard.nextStep();
            }
        },
        onPasoAnterior1: function () {
            var oWizard = this.byId("wizardId");
            var oStepActual = this.byId("PrimerStep");
            oWizard.previousStep();
        },
        onInformacionValidacion: function () {

        },
        onSiguientePaso2: function () {
            var oWizard = this.byId("wizardId");
            var oStepActual = this.byId("SegundoStep");

            this.onInformacionValidacion();

            if (oStepActual.getValidated()) {
                oWizard.nextStep();
            }
        },
        onInformacionValidacion: function () {
            var oWizard = this.byId("wizardId");
            var oStep2 = this.byId("SegundoStep");

            var bCompleto =
                !!this.byId("inpSucursal").getValue().trim() &&
                !!this.byId("inpPedido").getValue().trim() &&
                !!this.byId("inpHojaEntrada").getValue().trim() &&
                !!this.byId("inpCentroCosto").getValue().trim() &&
                !!this.byId("inpEjercicio").getValue().trim() &&
                !!this.byId("cmbMoneda").getSelectedKey() &&
                !!this.byId("inpImporte").getValue().trim();

            if (bCompleto) {
                oWizard.validateStep(oStep2);
            } else {
                oWizard.invalidateStep(oStep2);
            }

        },
        onCancelarSolicitud: function () {

            sap.m.MessageBox.confirm(
                "¿Desea cancelar la solicitud?",
                {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: function (sAction) {

                        if (sAction === sap.m.MessageBox.Action.YES) {

                            sap.m.MessageToast.show("Solicitud cancelada");

                            // ejemplo: limpiar wizard o volver
                            var oWizard = this.byId("wizardId");
                             this._resetFormulario();
                            oWizard.discardProgress(oWizard.getSteps()[0]);
                        }

                    }.bind(this)
                }
            );

        },
        // =============================
        // MATCHCODE PEDIDO
        // =============================
        onValueHelpPedido: function (oEvent) {

            var oInput = oEvent.getSource();

            var oDialog = new sap.m.SelectDialog({
                title: "Seleccionar Pedido",
                items: [
                    new sap.m.StandardListItem({ title: "4500000010", description: "Pedido Materiales" }),
                    new sap.m.StandardListItem({ title: "4500000020", description: "Pedido Servicios" }),
                    new sap.m.StandardListItem({ title: "4500000030", description: "Pedido Mantenimiento" })
                ],
                confirm: function (oEvent) {
                    var oItem = oEvent.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }
            });

            oDialog.open();
        },


        // =============================
        // MATCHCODE CENTRO COSTO
        // =============================
        onValueHelpCentroCosto: function (oEvent) {

            var oInput = oEvent.getSource();

            var oDialog = new sap.m.SelectDialog({
                title: "Seleccionar Centro de Costo",
                items: [
                    new sap.m.StandardListItem({ title: "CC1000", description: "Administración" }),
                    new sap.m.StandardListItem({ title: "CC2000", description: "Operaciones" }),
                    new sap.m.StandardListItem({ title: "CC3000", description: "Mantenimiento" })
                ],
                confirm: function (oEvent) {
                    var oItem = oEvent.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }
            });

            oDialog.open();
        },


        // =============================
        // MATCHCODE CENTRO BENEFICIO
        // =============================
        onValueHelpCentroBeneficio: function (oEvent) {

            var oInput = oEvent.getSource();

            var oDialog = new sap.m.SelectDialog({
                title: "Seleccionar Centro de Beneficio",
                items: [
                    new sap.m.StandardListItem({ title: "CB1000", description: "Refinación" }),
                    new sap.m.StandardListItem({ title: "CB2000", description: "Distribución" }),
                    new sap.m.StandardListItem({ title: "CB3000", description: "Comercialización" })
                ],
                confirm: function (oEvent) {
                    var oItem = oEvent.getParameter("selectedItem");
                    if (oItem) {
                        oInput.setValue(oItem.getTitle());
                        this.onInformacionValidacion();
                    }
                }
            });

            oDialog.open();
        },
        _resetFormulario: function () {

            var oWizard = this.byId("wizardId");

            // Inputs Step 1
            this.byId("inpSociedad").setValue("");
            this.byId("inpProveedor").setValue("");

            // Combo Step 1
            this.byId("cmbTipoSolicitud").setSelectedKey("");
            this.byId("cmbUbicacion").setSelectedKey("");

            // Inputs Step 2
            this.byId("inpSucursal").setValue("1101"); // valor default
            this.byId("inpPedido").setValue("");
            this.byId("inpHojaEntrada").setValue("");
            this.byId("inpCentroCosto").setValue("");
            this.byId("inpEjercicio").setValue("");
            this.byId("inpImporte").setValue("");
            this.byId("inpReferencia").setValue("");
            this.byId("inpCentroBeneficio").setValue("");

            // Combo Step 2
            this.byId("cmbMoneda").setSelectedKey("");

            // Reset Wizard
            oWizard.discardProgress(oWizard.getSteps()[0]);

            // Reset validaciones
            oWizard.invalidateStep(this.byId("PrimerStep"));
            oWizard.invalidateStep(this.byId("SegundoStep"));

        },
        onComentariosValidacion:function(){
            var oWizard = this.byId("wizardId");
            var oStep3 = this.byId("TercerStep");

            var bCompleto =
                !!this.byId("txtComentarios").getValue().trim();

            if (bCompleto) {
                oWizard.validateStep(oStep3);
            } else {
                oWizard.invalidateStep(oStep3);
            }

        },
         onPasoAnterior2: function () {
            var oWizard = this.byId("wizardId");
            var oStepActual = this.byId("SegundoStep");
            oWizard.previousStep();
        },
        onPasoSiguiente3:function(){
            var oWizard = this.byId("wizardId");
            var oStepActual = this.byId("TercerStep");

            this.onComentariosValidacion();

            if (oStepActual.getValidated()) {
                oWizard.nextStep();
            }
        }
    });
});