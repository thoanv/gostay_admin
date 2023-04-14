import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './style.css';

function AvatarInTable(props) {
    const { src, height, alt, style, width, defaul, title, normal } = props;
    const [showImg, setShowAvatar] = useState(false);

    if (src) return (
        <React.Fragment>
            {normal ? <img
                className={"image-popup"}
                src={src}
                alt={alt ? alt : "image"}
                title={title ? title :"user"}
                style={style ? style : null}
                onClick={() => setShowAvatar(true)}
                ></img> : <img

                className={defaul ? "avatar-in-table-2" : "avatar-in-table"}
                src={src}
                alt={alt ? alt : "image"}
                title={title ? title :"user"}
                style={style ? style : null}
                onClick={() => setShowAvatar(true)}
                ></img>}
            <Modal isOpen={showImg} toggle={() => setShowAvatar(false)}>
                <ModalHeader toggle={() => setShowAvatar(false)}>
                </ModalHeader>
                <ModalBody>
                    <img
                        src={src}
                        alt={alt ? alt : "image"}
                        style={{ width: "100%" }}
                    ></img>
                </ModalBody>
            </Modal>
        </React.Fragment>

    )
    else return null;
}

export default AvatarInTable;