import { useState, useEffect } from 'react';

const Meme = (props) => {
    const { meme } = props;
    const { image, phrases } = meme;

    return (
        <div className='meme-container' >

            <img src={image.path} />
            
            {/*Show all meme phrases*/}
            {phrases ? phrases.map((p) => {
                return (
                    <div key={p.id}
                        className='div-text'
                        style={{
                            height: p.height,
                            width: p.width,
                            left: p.x,
                            top: p.y,
                            color: meme.color,
                            fontFamily: meme.font,
                        }}
                    >

                        <p>{p.text}</p>

                    </div>);
            }) : ''}

        </div>
    );
}

export default Meme;