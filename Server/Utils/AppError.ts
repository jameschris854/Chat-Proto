class AppError extends Error {
    
    statusCode: number
    msg: string
    stackTrace: string | undefined

    constructor(msg:string,statusCode:number){
        super(msg)
        this.msg = msg;
        this.statusCode = statusCode 
        this.stackTrace = super.stack
    }
}

export default AppError;