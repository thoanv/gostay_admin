import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './style.css';

function ImageInTable(props) {
    const { src, height, alt, style } = props;
    const [showImg, setShowImg] = useState(false);

    if (src) return (
        <React.Fragment>
            <img
                className="img-in-table"
                src={src}
                alt={alt ? alt : "image"}
                height={style ? ((style.height || style.maxHeight) ? (style.height || style.maxHeight) : "auto") : (height ? height : "40")}
                style={style ? style : null}
                onClick={() => setShowImg(true)}
            ></img>
            <Modal isOpen={showImg} toggle={() => setShowImg(false)}>
                <ModalHeader toggle={() => setShowImg(false)}>
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
    else return "";
}

export default ImageInTable;