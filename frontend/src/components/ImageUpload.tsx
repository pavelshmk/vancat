import React from 'react';
import Dropzone from "react-dropzone";

interface IProfileFormImageProps {
    image?: File | string;
    onChange: (val: File | string) => any;
}

const ImageUpload = ({ image, onChange }: IProfileFormImageProps) => {
    if (!image) {
        return (
            <Dropzone accept={['image/jpeg', 'image/png', 'image/gif']} onDrop={val => val[0] && (val[0].size <= 20 * 10**20) && onChange(val[0])}>
                {({ getRootProps, getInputProps }) => (
                    <div className="main-form__profile" {...getRootProps()}>
                        <label className="label-img label-img_small" htmlFor="input-img">
                            <p className="label-img__text">JPG, PNG or GIF. <br/> 20MB
                                max size.</p>
                            <p className="label-img__text">Drag and drop an image here, or click to
                                browse</p>
                        </label>
                        <input {...getInputProps()} />
                    </div>
                )}
            </Dropzone>
        )
    }
    return (
        <div className="main-form__profile">
            <div className="main-form__img">
                <img src={image instanceof File ? URL.createObjectURL(image) : image} />
            </div>
            <div className="main-form__file">
                {image instanceof File && (
                    <>
                        <span className="main-form__fil">{image.name}</span>
                        <span className="main-form__fil">{image.size} B</span>
                    </>
                )}
                <button className="main-form__btn" type="button" onClick={() => onChange(undefined)}>
                    <img src={require('url:../images/4.svg')} alt="alt"/>
                    <span className="main-form__delete">delete file</span>
                </button>
            </div>
        </div>
    )
}

export default ImageUpload;
