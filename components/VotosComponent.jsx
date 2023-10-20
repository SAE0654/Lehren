import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';

const VotosComponent = ({ id, likes, dislikes }) => {
    const [NumberLikes, setNumberLikes] = useState(0);
    const [NumberDislikes, setNumberDislikes] = useState(0);
    const [HasBeenLiked, setHasBeenLiked] = useState(false);

    const { data } = useSession();

    useEffect(() => {
        setNumberDislikes(dislikes.length);
        setNumberLikes(likes.length);
    }, [id]);

    useEffect(() => {
        likeOrDisliked();
    }, [NumberLikes, NumberDislikes])


    const likeOrDisliked = () => {
        if (likes.indexOf(data.user.email) !== -1) {
            setHasBeenLiked(true);
            return;
        }
        if (dislikes.indexOf(data.user.email) !== -1) {
            setHasBeenLiked(false);
            return;
        }
        setHasBeenLiked(null);
    }

    const Like = () => {
        const _likes = likes;
        _likes = _likes.filter((idLiker) => idLiker === data.user.email);
        const isInDislikes = dislikes.indexOf(data.user.email);
        if (_likes.length > 0) {
            const index = likes.indexOf(data.user.email);
            likes.splice(index, 1);
            quitarLike(index)
            return;
        };
        likes.push(data.user.email);
        if (isInDislikes !== -1) {
            quitarDislike(isInDislikes);
        }
        axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/like=` + id, likes)
            .then(() => {
                setNumberLikes(likes.length);
                setNumberDislikes(dislikes.length);
            })
    }

    const quitarDislike = (index) => {
        dislikes.splice(index, 1);
        axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/dislike=` + id, dislikes)
            .then(() => {
                setNumberLikes(likes.length);
                setNumberDislikes(dislikes.length);
            })
    }

    const quitarLike = (index) => {
        likes.splice(index, 1);
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
        if (_dislikes.length > 0) {
            const index = dislikes.indexOf(data.user.email);
            dislikes.splice(index, 1);
            quitarDislike(index)
            return;
        };
        dislikes.push(data.user.email);
        if (isInLikes !== -1) {
            quitarLike(isInLikes);
        }
        axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/votacion/dislike=` + id, dislikes)
            .then(() => {
                setNumberLikes(likes.length);
                setNumberDislikes(dislikes.length);
            })
    }



    return <div className="like_dislike_box">
        <div className="box_like">
            {
                HasBeenLiked ?
                    <AiFillLike className="icon" onClick={() => Like()} /> :
                    <AiOutlineLike className="icon" onClick={() => Like()} />
            }
            <span className={NumberLikes > NumberDislikes ? "taked" : null}>
                {NumberLikes}
            </span>
        </div>
        <div className="box_like">
            {
                HasBeenLiked ?
                    <AiOutlineDislike className="icon" onClick={() => Dislike()} />
                    : HasBeenLiked === null ?
                    <AiOutlineDislike className="icon" onClick={() => Dislike()} />
                        : <AiFillDislike className="icon" onClick={() => Dislike()} />
            }
            <span className={NumberDislikes > NumberLikes ? "taked" : null}>
                {NumberDislikes}
            </span>
        </div>
    </div>
}

export default VotosComponent;