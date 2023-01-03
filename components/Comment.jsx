import React from "react"

export default function Comment({ comments }) {

    if (typeof comments === 'undefined') {
        return <div className="comment_card_container">
            <p className="scroll disabled">No se han agregado comentarios</p>
        </div>
    }
    if (comments === null || comments.length === 0) {
        return <div className="comment_card_container">
            <p className="scroll disabled">No se han agregado comentarios</p>
        </div>
    }
    return <div className="comment_card_container">
        <h2>{comments[0].user} <span>Agregado el {comments[0].createdAt}</span> </h2>
        <p className="scroll">{comments[0].comentarios}</p>
    </div>
}
