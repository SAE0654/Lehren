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
        ExpressionAttributeValues: { [':' + campo]: valor },
    };
    try {
        console.log("sort ")
        const data = await db.query(params).promise();
        return data;
    } catch (error) {
        return []
    }
}

export async function UpdateCamposFaseValidacion({nombre, prioridad, objetivo, instrumentoValidacion, generalComments, fechaEntrega, fechaEjecucion, etapa, statusProducto, archivosETP2}) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: 'set prioridad = :p, objetivo = :o, instrumentoValidacion = :i, generalComments = :g, fechaEntrega = :fEntrega, fechaEjecucion = :fEjecucion, etapa = :e, statusProducto = :s, archivosETP2 = :a',
        ExpressionAttributeValues: {
            ':p': prioridad,
            ':o': objetivo,
            ':i': instrumentoValidacion,
            ':g': generalComments,
            ':fEntrega': fechaEntrega,
            ':fEjecucion': fechaEjecucion,
            ':e': etapa,
            's': statusProducto,
            'a': archivosETP2
        },
    }
    return executar(params);
}

export async function UpdateToNoAprobado({ nombre, statusProducto, etapa, aprobadoPor, comentarios}) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: 'set statusProducto = :s, etapa = :e, aprobadoPor = :a, comentarios = :c',
        ExpressionAttributeValues: {
            ':s': statusProducto,
            ':e': etapa,
            ':a': aprobadoPor,
            ':c': comentarios
        },
    }
    return executar(params);
}

export async function UpdateUrlETP(nombre, carga, etapa) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: `set ${etapa} = :e`,
        ExpressionAttributeValues: {
            ':e': carga
        },
    }
    return executar(params);
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
    return executar(params);
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

export async function UpdaP1_Productosatus(nombre, nuevoStatus, nuevaEtapa) {
    const params = {
        TableName: 'P1_Productos',
        Key: {
            nombre: nombre
        },
        UpdateExpression: 'set statusProducto = :s, etapa = :e',
        ExpressionAttributeValues: {
            ':s': nuevoStatus,
            ':e': nuevaEtapa
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

async function executar(params) {
    try {
        const _data = await db.update(params).promise();
        return _data;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

