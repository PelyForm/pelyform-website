const generateCreatedAndUpdatedDate = (createdAt, updatedAt)=>{
    if(!createdAt){
        createdAt = new Date()
        updatedAt = createdAt
    }
    return {
        createdAt,
        updatedAt
    }
}

const generateUpdatedDate =  (updatedAt) => {
    if(!updatedAt){
        updatedAt = new Date()
    }
    return {
        updatedAt
    }
}

module.exports = {
    generateCreatedAndUpdatedDate,
    generateUpdatedDate
}