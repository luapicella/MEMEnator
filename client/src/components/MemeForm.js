import { Col, Row, Image, Form, Button, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Redirect, Link, useLocation } from 'react-router-dom';

import AlertManager from './AlertManager';
import Meme from './Meme';


const MemeForm = (props) => {
    /*location for copy state*/
    const location = useLocation();
    const text = location.state ? 'Copy meme' : 'Create meme';

    const { images, onSave } = props;

    /*initial state for create or copy operation */
    const initialState = {
        imageID: location.state ? location.state.meme.image.id : '',
        imageSRC: location.state ? location.state.meme.image.path : '',
        phrases: location.state ? location.state.meme.phrases.map((p) => ({ id: p.property, text: p.text })) : [],
        title: location.state ? location.state.meme.title : '',
        protect: location.state ? Boolean(location.state.meme.protect) : false,
        color: location.state ? location.state.meme.color : 'white',
        font: location.state ? location.state.meme.font : 'impact',
    }

    const disbledCheckProtected = location.state ? location.state.meme.protect && !location.state.isMine : false;

    /*form data*/
    const [imageID, setImageID] = useState(initialState.imageID)
    const [imageSRC, setImageSRC] = useState(initialState.imageSRC);
    const [phrases, setPhrases] = useState(initialState.phrases);
    const [title, setTitle] = useState(initialState.title);
    const [protect, setProtect] = useState(initialState.protect);
    const [color, setColor] = useState(initialState.color);
    const [font, setFont] = useState(initialState.font);

    /*route state*/
    const [submitted, setSubmitted] = useState(false);

    /*validation state*/
    const [valid, setValid] = useState(true);
    const [errorsForm, setErrorsForm] = useState([]);
    const ERROR = { IMAGECONSTRAINTS: -1, TITLECONSTRAINTS: -2, TEXTCONSTRAINTS: -3 }

    /*change the image and phrases dynamically*/
    useEffect(() => {
        if (imageID !== '' && images.length) {
            const image = images.find((i) => i.id == imageID)
            setImageSRC(image.path)
            if (!location.state)
                setPhrases(image.phrases.map(p => ({ id: p, text: '' })));
        } else {
            setPhrases([]);
            setImageSRC('');
        }
    }, [imageID])

    const handleOnCloseError = (IDERROR) => {
        setErrorsForm((oldError) => {
            return oldError.filter((e) => {
                if (e.id === IDERROR)
                    return false;
                return true;
            })
        })
    }

    const handleChangeText = (ev) => {
        setPhrases((oldPhrases) => {
            return oldPhrases.map(item => {
                if (item.id == ev.target.name)
                    return { id: item.id, text: ev.target.value }
                else
                    return item;
            })
        })
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (checkValidity()) {
            setValid(true)

            const meme = {
                image: imageID,
                title: title,
                phrases: phrases.filter((p) => p.text !== ''),
                protect: protect,
                color: color,
                font: font,
            }

            onSave(meme)
            setSubmitted(true);
        }
        else {
            setValid(false)
        }
    };

    const checkValidity = (prosp) => {
        let valid = true;
        setErrorsForm([])

        if (imageID === '') {
            setErrorsForm((oldError) => [...oldError, { id: ERROR.IMAGECONSTRAINTS, msg: "Image is required" }])
            valid = false;
        }
        if (title === '') {
            setErrorsForm((oldError) => [...oldError, { id: ERROR.TITLECONSTRAINTS, msg: "Title is required" }])
            valid = false;
        } else if (title.length > 100) {
            setErrorsForm((oldError) => [...oldError, { id: ERROR.TITLECONSTRAINTS, msg: "Title must have a maximum of one hundred characters" }])
            valid = false;
        }
        if (!phrases.some((p) => p.text !== '')) {
            setErrorsForm((oldError) => [...oldError, { id: ERROR.TEXTCONSTRAINTS, msg: "At least one text is required" }])
            valid = false;
        } else if (phrases.some((p) => p.text.length > 100)) {
            setErrorsForm((oldError) => [...oldError, { id: ERROR.TEXTCONSTRAINTS, msg: "Text must have a maximum of one hundred characters" }])
            valid = false;
        }

        return valid
    }


    return (

        <>
            {submitted

                ? <Redirect to='/home' />

                : <>
                    <Container>
                        <Row>

                            <Col sm={8} className="below-nav vheight-100 ">

                                {/*validation errors*/}
                                {!valid ? <AlertManager variant='danger' msgs={errorsForm} onClose={handleOnCloseError} /> : ''}

                                <h5>{text}</h5>

                                <Form noValidate onSubmit={handleSubmit}>

                                    <Form.Row>

                                        <Form.Group as={Col} controlId='title-form'>
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control type="text" placeholder='title'
                                                name='title' value={title} onChange={ev => setTitle(ev.target.value)} />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Base image</Form.Label>
                                            <Form.Control as="select" value={imageID} onChange={(ev) => setImageID(ev.target.value)} disabled={location.state || !images.length}>
                                                {images.length
                                                    ? <option value='' disabled hidden> Choose an image</option>
                                                    : <option value='' disabled hidden>🕗 Loading images 🕗</option>
                                                }
                                                {images.map(item => {
                                                    return (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    );
                                                })}
                                            </Form.Control>
                                        </Form.Group>

                                    </Form.Row>

                                    {/*Meme phrases that change dynamically*/}
                                    {phrases.map((p, index) => {

                                        return (

                                            <Form.Group sm={4} key={p.id} controlId={p.id}>
                                                <Form.Label>{`Text ${index + 1}`}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={`text ${index + 1}`}
                                                    name={p.id}
                                                    value={p.text}
                                                    onChange={handleChangeText}
                                                />
                                            </Form.Group>
                                        );
                                    })}

                                    {phrases.length

                                        ? <Form.Group controlId="formColorFont" >
                                            <Form.Row>
                                                <Col>
                                                    <Form.Label>Color</Form.Label>
                                                    <Form.Control as="select" name='color' value={color} onChange={(ev) => setColor(ev.target.value)} >
                                                        <option value="white">White</option>
                                                        <option value="red">Red</option>
                                                        <option value="green">Green</option>
                                                        <option value="blue">Blue</option>
                                                    </Form.Control>
                                                </Col>

                                                <Col>
                                                    <Form.Label>Font</Form.Label>
                                                    <Form.Control as="select" name='font' value={font} onChange={(ev) => setFont(ev.target.value)} >
                                                        <option value="impact">Impact</option>
                                                        <option value="helvetica">Helvetica</option>
                                                    </Form.Control>
                                                </Col>

                                            </Form.Row>
                                        </Form.Group>
                                        : ''}

                                    <Form.Group controlId="formMemeCheck">
                                        <Form.Check type="checkbox" label="Protect" name="isProtect" checked={protect} onChange={(ev) => setProtect(ev.target.checked)} disabled={disbledCheckProtected} />
                                    </Form.Group>

                                    <Link to='/home'><Button className="mr-2" variant="secondary">Cancel</Button></Link>

                                    <Button variant="success" type="submit"> Save</Button>

                                </Form>

                            </Col>

                            {/*Show the image chosen*/}
                            {imageSRC !== '' ? <Image className='image-form below-nav' src={imageSRC} rounded /> : ''}


                        </Row>
                    </Container>
                </>
            }
        </>
    );

}

export default MemeForm;
