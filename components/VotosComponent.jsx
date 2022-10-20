import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';

const VotosComponent = ({id, likes, dislikes}) => {
    const [NumberLikes, setNumberLikes] = useState(0);
    const [NumberDislikes, setNumberDislikes] = useState(0);

    const { data } = useSession();

    console.log(data)

    useEffect(() => {
        setNumberDislikes(dislikes.length);
        setNumberLikes(likes.length);
    }, [])
    

    const Like = () => {
        const _likes = likes;
        _likes = _likes.filter((idLiker) => idLiker === data.user.email);
        const isInDislikes = dislikes.indexOf(data.user.email);
        if(_likes.length > 0) return;
        likes.push(data.user.email);
        if(isInDislikes !== -1) {
            dislikes.splice(isInDislikes, 1);
            axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/dislike=` + id, dislikes);
        }
        axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/like=` + id, likes)
        .then(() => {
            setNumberLikes(likes.length);
            setNumberDislikes(dislikes.length);
        })
    }

    const Dislike = () => {
        const _dislikes = dislikes;
        _dislikes = _dislikes.filter((idDisliker) => idDisliker === data.user.email);
        const isInLikes = likes.indexOf(data.user.email);
        if(_dislikes.length > 0) return;
        dislikes.push(data.user.email);
        if(isInLikes !== -1) {
            likes.splice(isInLikes, 1);
            axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/like=` + id, likes);
        }
        axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/dislike=` + id, dislikes)
        .then(() => {
            setNumberLikes(likes.length);
            setNumberDislikes(dislikes.length);
        })
    }

    return <div className="like_dislike_box">
        <div className="box_like">
            <AiOutlineLike className="icon" onClick={() => Like()} />
            <span className={NumberLikes > NumberDislikes ? "taked" : null}>
                {NumberLikes}
            </span>
        </div>
        <div className="box_like">
            <AiOutlineDislike className="icon" onClick={() => Dislike()} />
            <span className={NumberDislikes > NumberLikes ? "taked" : null}>
                {NumberDislikes}
            </span>
        </div>
    </div>
}

export default VotosComponent;