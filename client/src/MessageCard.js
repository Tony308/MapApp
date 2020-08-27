import React from 'react';
import {Card, CardText, CardTitle, Form, Label, FormGroup, ButtonToggle} from 'reactstrap';

export default (props) => {
    return (

        <Card body className='message-form'>
            <CardTitle>Welcome to Hell where the CSS don't ***king work</CardTitle>
            <CardText>Leave a message with your location!</CardText>
            <CardText>Thanks for dropping by!</CardText>
            {
                !props.sendingMessage && !props.sentMessage ? 
                <Form onSubmit={props.formSubmitted}>
                    <FormGroup>
                        <Label for='name'>Name:</Label> <br/>
                        <input onChange={props.handleChange} type='text' name='name' id='name' placeholder='Enter your name' />
                    </FormGroup>
                    <FormGroup>
                        <Label for="message">Message:</Label><br/>
                        <textarea onChange={props.handleChange} name='message' id='message' placeholder='Enter a message' />
                    </FormGroup>
                    <ButtonToggle type='submit' color="info" disabled={!props.formIsValid()} >Send</ButtonToggle>
                </Form>
                :
                props.sendingMessage ? <img src='https://media.giphy.com/media/8rFvX2jLDn2vkVihUG/giphy.gif' alt='loading' />
                :
                <CardText>Thanks for submitting message.</CardText>
                    }
            </Card>
    );
}