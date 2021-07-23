import { Button, Modal, Badge } from 'react-bootstrap';

import { Lock, Unlock } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';


import Meme from './Meme';


const MemeModal = (props) => {
    const { meme, onClose } = props;

    return (
        <>
            <Modal animation={false} centered show onHide={onClose}>
               
                <Modal.Header closeButton>
                    
                    <Modal.Title id="example-custom-modal-styling-title">
                        {`Title: ${meme.title}`}
                        <Badge className="ml-2" variant="dark">
                            {meme.protect
                                ? <Lock /> : <Unlock />}
                            {meme.protect
                                ? ' protect' : ' public'}
                        </Badge>
                    </Modal.Title>
                
                </Modal.Header>
                
                <Modal.Body>
                    
                    <Meme meme={meme} />
                    <br />
                    {`Create by : ${meme.nameCreator}`}
                
                </Modal.Body>
                
                <Modal.Footer>
                   
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                
                </Modal.Footer>
           
            </Modal>
        </>
    );
}

export default MemeModal;