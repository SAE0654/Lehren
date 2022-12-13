import db from "./db";

export async function UpdateUserField(email, rol, password, names, camposACambiar) {
    const camposActualizables = {
        rol: rol,
        password: password,
        names: names
    }
    const _camposACambiar = camposACambiar.split(",");
    _camposACambiar.map(async (campo) => {

        const params = {
            TableName: 'P1_Usuarios',
            Key: {
                'email': email
            },
            KeyConditionExpression: 'email = :email',
            UpdateExpression: `set #${campo} = :v_${campo}`,
            ExpressionAttributeNames: {
                ['#' + campo]: campo
            },
            ExpressionAttributeValues: {
                [':v_' + campo]: camposActualizables[campo]
            },
            ReturnValues: 'ALL_NEW'
        }
        try {
            const _data = await db.update(params).promise();
            return _data;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    })
}

/*
############### OPERACIONES DE PRODUCTOS ##################
*/

export async function GetProductosByIndexDB(indexCampo, campo, valor) {
    const params = {
        TableName: 'P1_Productos',
        IndexName: indexCampo,
        KeyConditionExpression: `${campo} = :${campo}`,
        ExpressionAttributeValues: { [':' + campo]: valor }
    };

    try {
        const data = await db.query(params).promise();
        return data;
    } catch (error) {
        return []
    }
}

export async function DeleteProductoByName(nombre) {
    var params = {
        Key: {
            nombre: nombre
        },
        TableName: 'P1_Productos'
    };

    try {
        await db.delete(params).promise();
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export async function UpdateResponsable(nombre, nuevoResponsable, ultimaActualizacion) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: 'set responsable = :r, lastUpdate = :l',
        ExpressionAttributeValues: {
            ':r': nuevoResponsable,
            ':l': ultimaActualizacion
        },
    }
    try {
        const _data = await db.update(params).promise();
        return _data;
    } catch (error) {
        throw new Error(error)
    }
}

export async function UpdateComment(nombre, comentario) {
    const comentarios = [{
        comentarios: comentario.comentarios,
        createdAt: comentario.createdAt,
        user: comentario.user
    }]
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: 'set comentarios = :c',
        ExpressionAttributeValues: {
            ':c': comentarios,
        },
    }
    return executar(params);
}

export async function VoteProduct(nombre, tipo, carga) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: `set ${tipo} = :voto`,
        ExpressionAttributeValues: {
            ':voto': carga,
        },
    }
    return executar(params);
}


async function executar(params) {
    try {
        const _data = await db.update(params).promise();
        return _data;
    } catch (error) {
        throw new Error(error)
    }
}
