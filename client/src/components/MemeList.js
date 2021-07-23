import { useState, useEffect } from 'react';
import { Col, Row, Button, Spinner, ListGroup, Container, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Clipboard, Trash, Plus, Eye } from 'react-bootstrap-icons';

import MemeModal from './MemeModal';

const MemeList = (props) => {
    const { memes, loggedIn, user, loading, onDelete } = props;

    const [showMeme, setShowMeme] = useState(false);
    const [memeToShow, setMemeToShow] = useState('')

    const handleClose = () => {
        setShowMeme(false);
        setMemeToShow('')
    }

    const handleShowMeme = (meme) => {
        setMemeToShow(meme);
        setShowMeme(true);
    }


    return (
        <>
            <Container>
                <Row>
                    <Col sm="12" className="below-nav vheight-100">

                        <h3>List of memes</h3>

                        {loading

                            ? <Spinner animation="border" />

                            : <ListGroup variant="flush">
                                {
                                    memes.map((m) => {
                                        return (

                                            <ListGroup.Item variant={m.status} key={m.id} className="d-flex w-100 justify-content-between" >

                                                <MemeRowData title={m.title} />

                                                {m.id !== 'dirty'
                                                    ? <MemeRowControl
                                                        meme={m}
                                                        isMine={user.id && m.user === user.id}
                                                        loggedIn={loggedIn}
                                                        onShow={() => handleShowMeme(m)}
                                                        onDelete={() => onDelete(m.id)}
                                                    />
                                                    : ''}

                                            </ListGroup.Item>
                                        );
                                    })
                                }
                            </ListGroup>
                        }


                        {showMeme ? <MemeModal meme={memeToShow} onClose={handleClose} /> : ''}
                    </Col>

                    {loggedIn ?
                        <div className='fixed-right-bottom'>
                            <Link to='/create'><Button variant='success'><Plus /></Button></Link>
                        </div>
                        : ''}
                </Row>
            </Container>
        </>
    );
}


const MemeRowData = (props) => {
    const { title, onShow } = props;

    return (
        <>
            <div className="flex-fill m-auto" >
                {title}
            </div>
        </>
    )
}

const MemeRowControl = (props) => {
    const { meme, isMine, onDelete, onShow, loggedIn } = props;
    return (
        <>
            <div className="ml-10">

                {isMine ? <Button className="mr-2" variant="danger" onClick={onDelete}><Trash /> Delete</Button> : ''}


                {loggedIn

                    ? <><Link to={{
                        pathname: '/create',
                        state: {
                            meme: meme,
                            isMine: isMine
                        },
                    }}><Button className="mr-2" variant="warning" ><Clipboard /> Copy</Button></Link>
                    </>
                    : ''}

                <Button className="mr-2" variant="success" onClick={onShow}><Eye /> Show</Button>

            </div>
        </>
    )
}


export default MemeList;