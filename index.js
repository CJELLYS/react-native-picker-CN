import {
    Platform,
    NativeModules,
    NativeAppEventEmitter
} from 'react-native';

let ios = Platform.OS === 'ios';
let android = Platform.OS === 'android';
let Picker = NativeModules.BEEPickerManager;

export default {

    init(options){
        let opt = {
            isLoop: false,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            pickerConfirmBtnColor: [65,203,118,1],
            pickerCancelBtnColor: [65,203,118,1],
            pickerTitleColor: [51,51,51,1],
            pickerToolBarBg: [240, 240, 240, 1],
            pickerBg: [250, 250, 250, 1],
            wheelFlex: [1, 1, 1],
            pickerData: [],
            selectedValue: [],
            onPickerConfirm(){},
            onPickerCancel(){},
            onPickerSelect(){},
            //4.0.12 add
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerFontColor: [31, 31 ,31, 1],
            ...options
        };
        let fnConf = {
            confirm: opt.onPickerConfirm,
            cancel: opt.onPickerCancel,
            select: opt.onPickerSelect
        };

        Picker._init(opt);
        //there are no `removeListener` for NativeAppEventEmitter & DeviceEventEmitter
        this.listener && this.listener.remove();
        this.listener = NativeAppEventEmitter.addListener('pickerEvent', event => {
            fnConf[event['type']](event['selectedValue'], event['selectedIndex']);
        });
    },

    show(){
        Picker.show();
    },

    hide(){
        Picker.hide();
    },

    select(arr, fn) {
        if(ios){
            Picker.select(arr);
        }
        else if(android){
            Picker.select(arr, err => {
                typeof fn === 'function' && fn(err);
            });
        }
    },

    toggle(){
        this.isPickerShow(show => {
            if(show){
                this.hide();
            }
            else{
                this.show();
            }
        });
    },

    isPickerShow(fn){
        //android return two params: err(error massage) and status(show or not)
        //ios return only one param: hide or not...
        Picker.isPickerShow((err, status) => {
            let returnValue = null;
            if(android){
                returnValue = err ? false : status;
            }
            else if(ios){
                returnValue = !err;
            }
            fn(returnValue);
        });
    }
};