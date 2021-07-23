import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap/';
import { Redirect, Switch, Route, Link, useParams } from 'react-router-dom';

import { EmojiSmile as Emoji } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';

const Navigation = (props) => {
    const { loggedIn, user } = props;

    return (
        <Navbar bg="success" variant="dark" fixed="top">

            <Navbar.Brand href="/">
                <Emoji className="mr-1" size="30" /> MEMEnator
            </Navbar.Brand>

            <Nav className="mr-auto">
                <Nav.Link as={Link} to='/home'>Home</Nav.Link>
            </Nav>

            <Nav className="justify-content-end">
                <Navbar.Text className="mx-2">
                    {user && user.name && `Welcome, ${user?.name}!`}
                </Navbar.Text>
                {loggedIn ?
                    <Nav.Link as={Link} to='/logout'><Button variant='light'>logout</Button></Nav.Link>
                    :
                    <Nav.Link as={Link} to='/login'><Button variant='light'>login</Button></Nav.Link>
                }
            </Nav>

        </Navbar>
    )
}

export default Navigation;