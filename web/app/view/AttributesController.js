/*
 * Copyright 2016 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ext.define('Traccar.view.AttributesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.attributes',

    requires: [
        'Traccar.view.AttributeDialog',
        'Traccar.store.Attributes'
    ],

    init: function () {
        var attribute, store, record, data = [], i = 0;
        store = Ext.create('Traccar.store.Attributes');
        store.setProxy(Ext.create('Ext.data.proxy.Memory'));
        for(var propertyName in this.getView().attributes) {
            store.add(Ext.create('Traccar.model.Attribute', {
                priority: i++,
                name: propertyName,
                value:this.getView().attributes[propertyName]
            }));
        }
        store.addListener('add', function (store , records , index , eOpts) {
            for (var i = 0; i < records.length; i++) {
                this.getView().attributes[records[i].get('name')] = records[i].get('value');
            }
        }, this);
        store.addListener('update', function  (store, record, operation , modifiedFieldNames , details , eOpts) {
            if (operation === Ext.data.Model.EDIT) {
                this.getView().attributes[record.get('name')] = record.get('value');
            }
        }, this);
        store.addListener('remove', function (store , records , index , isMove , eOpts) {
            delete this.getView().attributes[records[index].get('name')];
        }, this);
        
        this.getView().setStore(store);
    },

    onAddClick: function () {
        var attribute, dialog;
        attribute = Ext.create('Traccar.model.Attribute');
        attribute.store = this.getView().getStore();
        dialog = Ext.create('Traccar.view.AttributeDialog');
        dialog.down('form').loadRecord(attribute);
        dialog.show();
    },

    onEditClick: function () {
        var attribute, dialog;
        attribute = this.getView().getSelectionModel().getSelection()[0];
        dialog = Ext.create('Traccar.view.AttributeDialog');
        dialog.down('form').loadRecord(attribute);
        dialog.show();
    },

    onRemoveClick: function () {
        var attribute = this.getView().getSelectionModel().getSelection()[0];
        Ext.Msg.show({
            title: Strings.stateName,
            message: Strings.sharedRemoveConfirm,
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: Strings.sharedRemove,
                no: Strings.sharedCancel
            },
            scope: this,
            fn: function (btn) {
                var store = this.getView().getStore();
                if (btn === 'yes') {
                    store.remove(attribute);
                    store.sync();
                }
            }
        });
    },

    onSelectionChange: function (selected) {
        var disabled = selected.length > 0;
        this.lookupReference('toolbarEditButton').setDisabled(disabled);
        this.lookupReference('toolbarRemoveButton').setDisabled(disabled);
    }
});
