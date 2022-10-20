import { useEffect, useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';

const VotosComponent = ({id, likes, dislikes}) => {
    const [Liked, setLiked] = useState(false);
    const [Disliked, setDisliked] = useState(false);

    useEffect(() => {
        console.log("DISLIKED OR LIKED");
        console.log(id, likes, dislikes)
    }, [Liked, Disliked])


    return <div className="like_dislike_box">
        <div className="box_like">
            <AiOutlineLike className="icon" onClick={() => setLiked(true)} />
            <span className="taked">0</span>
        </div>
        <div className="box_like">
            <AiOutlineDislike className="icon" onClick={() => setDisliked(true)} />
            <span>0</span>
        </div>
    </div>
}

export default VotosComponent;