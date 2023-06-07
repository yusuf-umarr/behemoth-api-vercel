const {ONE_SIGNAL_CONFIG} = require("../config/app.config");
const pushNotificationService = require("../services/push-notification.service");
const User = require("../models/user");



const sendWalletNotification = async(req, res, next,) => {

    let user = await User.findById(req.user);
    const { amount} = req.body;

    let headingText ="Wallet Funded"
    let contentText =`You have successfuly added ${amount} to your wallet `
    let deviceId =user.oneSignalId
 

    try {

        // console.log("send wallet called1");

                var message = {
                app_id: ONE_SIGNAL_CONFIG.APP_ID,
                headings: {"en": headingText}, 
                contents: {"en": contentText},
                included_segments:["include_player_ids"],
                include_player_ids: [deviceId],
                content_available: true, 
                small_icon: "ic_notification_icon",
                data:{
                    PushTitle: "CUSTOM NOTIFICATION",
                },
        
            };

            pushNotificationService.SendNotification(message,(error, results)=>{
                if (error) {
                    return next(error);  
                }
                //  res.status(200).send({
                //     message: "Success",
                //     data: results,
                // })
              
        
            });
            next();

 
        
    } catch (error) {
        
    }

}

module.exports = sendWalletNotification;
