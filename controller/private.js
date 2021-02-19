exports.getPrivateData = (req, res, next) => {
    res.status(200).json({
        sucess: true,
        data: "Acesso privado confirmado"
    })
}