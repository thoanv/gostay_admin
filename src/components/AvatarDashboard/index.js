import React from 'react';
import './style.css';

function AvatarDashBoard(props) {
    const { src, height, alt, style, width, defaul, title } = props;


    if (src) return (
        <React.Fragment>
            <img

                className="avatar-dashboard"
                src={src}
                alt={alt ? alt : "image"}
                title={title ? title : "user"}
                style={style ? style : null}

            ></img>

        </React.Fragment>

    )
    else return null;
}

export default AvatarDashBoard;