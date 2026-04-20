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

            // wizard
            var oWizard = this.byId("wizSolicitud");
            // deshabilitar botonera por defecto
            oWizard.setShowNextButton(false);

            this._filesLocal = this.getOwnerComponent().getModel("filesLocal");
            this._oFilesModel = this.getOwnerComponent().getModel("files") || null;

            if (this._filesLocal) {
                this._filesLocal.setProperty("/items", []);
                this.getView().setModel(this._filesLocal, "filesLocal");
            }

            console.log("filesLocal owner:", this.getOwnerComponent().getModel("filesLocal"));
            console.log("filesLocal view:", this.getView().getModel("filesLocal"));

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

        _limpiarPaso2: function () {

            var aControles = [
                // Multa
                "inpSucursal",
                "inpPedido",
                "inpHojaEntrada",
                "inpCentroCosto",
                "inpEjercicio",
                "cmbMoneda",
                "inpImporte",
                "inpReferencia",
                "inpCentroBeneficio",

                // Reintegro
                "inpNroPedidoReintegro",
                "inpHojaEntradaServReintegro",

                // Fondo Reparo
                "inpPedidoReparo",
                "inpHojaReparo",
                "inpEjercicioReparo",
                "cmbMonedaReparo",
                "inpImporteReparo",
                "inpReferenciaReparo"
            ];

            aControles.forEach(function (sId) {
                var oControl = this.byId(sId);

                if (!oControl) {
                    return;
                }

                // Inputs
                if (oControl.setValue) {
                    oControl.setValue("");
                }

                // ComboBox
                if (oControl.setSelectedKey) {
                    oControl.setSelectedKey("");
                }

            }.bind(this));

            // 👉 Opcional: valores fijos que querés mantener
            if (this.byId("inpSucursal")) {
                this.byId("inpSucursal").setValue("1101");
            }

            if (this.byId("inpSucursalReparo")) {
                this.byId("inpSucursalReparo").setValue("1101");
            }
        },

        onTipoSolicitudChange: function (oEvent) {
            var oWizard = this.getView().byId("wizSolicitud");
            var sKey = oEvent.getSource().getSelectedKey();
            var oUIModel = this.getView().getModel("ui");

            oUIModel.setProperty("/tipoSolicitud", sKey);
            oUIModel.setProperty("/showMulta", sKey === "1");
            oUIModel.setProperty("/showReintegro", sKey === "2");
            oUIModel.setProperty("/showFondoReparo", sKey === "3");

            // opcional: limpiar campos del paso 2
            this._limpiarPaso2();

            // Invalidar pasos siguientes
            oWizard.invalidateStep(this.byId("stpInformacion"));
            oWizard.invalidateStep(this.byId("stpComentarios"));
            oWizard.invalidateStep(this.byId("stpAdjuntos"));

            // Descartar progreso desde step 2
            oWizard.discardProgress(this.byId("stpInformacion"));

            // clave: resetear desde cabecera, no desde informacion
            oWizard.discardProgress(this.byId("stpCabecera"));

            // y reposicionarte en el step 1
            oWizard.goToStep(this.byId("stpCabecera"), true);

            this.onCabeceraValidacion();

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
            var sTipo = this.getView().getModel("ui").getProperty("/tipoSolicitud");
            var bCompleto = false;

            if (sTipo === "1") {

                bCompleto =
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
            }
            else if (sTipo === "2") {

                // Reintegro
                bCompleto =
                    !!this.byId("cmbTipoSolicitudReintegro").getSelectedKey() &&
                    !!this.byId("inpNroPedidoReintegro").getValue().trim() &&
                    !!this.byId("inpHojaEntradaServReintegro").getValue().trim();

                if (bCompleto) {
                    oWizard.validateStep(oStepInformacion);
                } else {
                    oWizard.invalidateStep(oStepInformacion);
                }
            } else if (sTipo === "3") {
                bCompleto =
                    !!this.byId("inpPedidoReparo").getValue().trim() &&
                    !!this.byId("inpHojaReparo").getValue().trim() &&
                    !!this.byId("inpEjercicioReparo").getValue().trim() &&
                    !!this.byId("cmbMonedaReparo").getSelectedKey() &&
                    !!this.byId("inpImporteReparo").getValue().trim();

                if (bCompleto) {
                    oWizard.validateStep(oStepInformacion);
                } else {
                    oWizard.invalidateStep(oStepInformacion);
                }
            }
        },

        onAdjuntosValidacion: function () {
            var oWizard = this.byId("wizSolicitud");
            var oStepAdjuntos = this.byId("stpAdjuntos");
            var oUploadSet = this.byId("us");

            var aItems = oUploadSet ? oUploadSet.getItems() : [];
            var aIncompleteItems = oUploadSet ? oUploadSet.getIncompleteItems() : [];
            var bValid = (aItems.length + aIncompleteItems.length) > 0;

            console.log("Items completos:", aItems);
            console.log("Items pendientes:", aIncompleteItems);
            console.log("Adjuntos válidos:", bValid);

            if (bValid) {
                oWizard.validateStep(oStepAdjuntos);
            } else {
                oWizard.invalidateStep(oStepAdjuntos);
            }

            return bValid;
        },

        onAfterItemAdded: function (oEvent) {
            MessageToast.show("after");
            var oItem = oEvent.getParameter("item");
            var oUploadSet = this.byId("us");

            if (!oItem || !oUploadSet) {
                return;
            }

            var aItems = oUploadSet.getItems() || [];
            var aIncompleteItems = oUploadSet.getIncompleteItems() || [];
            var iTotal = aItems.length + aIncompleteItems.length;

            if (iTotal > 5) {
                MessageBox.error("Solo podés subir hasta 5 archivos.");
                oUploadSet.removeItem(oItem);
                return;
            }
            console.log("_addFileToLocalModel");
            this._addFileToLocalModel(oItem);
        },

        onSiguientePaso4: function () {
            var oWizard = this.byId("wizSolicitud");
            var bValid = this.onAdjuntosValidacion();

            if (bValid) {
                oWizard.nextStep();
            } else {
                sap.m.MessageToast.show("Debe adjuntar al menos un archivo.");
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

        onPasoAnterior3: function () {
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
        },

        onBeforeUpload: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var oUploadSet = this.byId("us");

            if (!oItem || !oUploadSet) {
                return;
            }

            // Ejemplo: si después necesitás token o cabeceras
            // var oCustomerHeaderToken = new UploadCollectionParameter({
            //     name: "x-csrf-token",
            //     value: "tu-token"
            // });
            // oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);

            // Si tu backend necesita URL dinámica:
            // oItem.setUploadUrl("/backend/adjuntos/upload");
        },

        onUploadCompleted: function (oEvent) {
            var oItem = oEvent.getParameter("item");

            if (oItem) {
                this._addFileToLocalModel(oItem);
            }

            MessageToast.show("Archivo subido correctamente.");
        },

        onFileRemoved: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var oModel = this.getOwnerComponent().getModel("filesLocal");

            if (!oItem || !oModel) {
                return;
            }

            var aItems = oModel.getProperty("/items") || [];
            var sFileName = oItem.getFileName();

            aItems = aItems.filter(function (oFile) {
                return oFile.fileName !== sFileName;
            });

            oModel.setProperty("/items", aItems);
            MessageToast.show("Archivo eliminado.");
        },

        _addFileToLocalModel: function (oItem) {
            var oModel = this._filesLocal;

            console.log("MODEL:", oModel);
            console.log("ITEM:", oItem);

            if (!oModel || !oItem) {
                console.log("No hay modelo o item");
                return;
            }

            var aItems = oModel.getProperty("/items") || [];
            var sFileName = oItem.getFileName();
            var bExists = aItems.some(function (oFile) {
                return oFile.fileName === sFileName;
            });

            if (bExists) {
                return;
            }

            var oFileObject = oItem.getFileObject ? oItem.getFileObject() : null;

            aItems.push({
                fileName: sFileName,
                mime: oItem.getMediaType ? oItem.getMediaType() : (oFileObject ? oFileObject.type : ""),
                url: "",
                size: oFileObject ? (oFileObject.size / 1024).toFixed(2) + " KB" : "",
                status: "Pendiente"
            });

            oModel.setProperty("/items", aItems);
            oModel.refresh(true);

            console.log("filesLocal actualizado:", oModel.getProperty("/items"));
        },

        onUploadAllFiles: function () {
            var oUploadSet = this.byId("us");
            if (oUploadSet) {
                oUploadSet.upload();
            }
        }

    });
});