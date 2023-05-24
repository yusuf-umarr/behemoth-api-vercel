const {ONE_SIGNAL_CONFIG} = require("../config/app.config");
const pushNotificationService = require("../services/push-notification.service");

exports.SendNotification = (req, res, next)=> {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        headings: {"en": req.body.heading}, 
        contents: {"en": req.body.content},
       
        //req.body.devices
        included_segments:["All"], // nofication to all the available devices
        content_available: true,  //notification will work in background
        small_icon: "ic_notification_icon",
        data:{
            PushTitle: "CUSTOM NOTIFICATION",
        },

    };

    pushNotificationService.SendNotification(message,(error, results)=>{
        if (error) {
            return next(error);  
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        })

    });
};

exports.SendNotificationToDevice = (req, res, next)=> {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        // contents: {"en": "Specific notiifcation"},
        headings: {"en": req.body.heading}, 
        contents: {"en": req.body.content},
        included_segments:["include_player_ids"], // nofication to a specific devices
        include_player_ids: req.body.devices,
        content_available: true,  //notification will work in background
        small_icon: "ic_notification_icon",
        data:{
            PushTitle: "CUSTOM NOTIFICATION",
        },

    };

    pushNotificationService.SendNotification(message,(error, results)=>{
        if (error) {
            return next(error);  
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        })

    });
};