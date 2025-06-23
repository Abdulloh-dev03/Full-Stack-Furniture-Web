import { Response } from "express";

class Send {
    static success(res:Response, data:any, message ="Success"){
        // 200 hammasi yaxshi
        res.status(200).json({
            ok:true,
            message,
            data
        });
        return;
    }

    static error(res:Response, data:any, message ="error"){
        // 500 server hatolari uchun
        res.status(500).json({
            ok:false,
            message,
            data
        });
        return;
    }

    static notFound(res:Response, data:any, message ="not found"){
        // 404 hech narsa topilmadi
        res.status(404).json({
            ok:false,
            message,
            data
        });
        return;
    }

    static badRequest(res:Response, data:any, message ="bad request"){
        // 400 noto'g'ri so'rov
        res.status(400).json({
            ok:false,
            message,
            data
        });
        return;
    }
    static unauthorized(res: Response, data: any = null, message: string = "Unauthorized") {
    res.status(401).json({ 
        success: false, 
        data, 
        message 
    });
    return;
    }
    static forbidden(res: Response, data: any = null, message: string = "Forbidden") {
        res.status(403).json({ 
            success: false, 
            data, 
            message 
        });
        return; 
    }
  }

export default Send;