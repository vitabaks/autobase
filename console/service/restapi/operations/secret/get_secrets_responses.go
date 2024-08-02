// Code generated by go-swagger; DO NOT EDIT.

package secret

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"postgesql-cluster-console/models"
)

// GetSecretsOKCode is the HTTP code returned for type GetSecretsOK
const GetSecretsOKCode int = 200

/*
GetSecretsOK OK

swagger:response getSecretsOK
*/
type GetSecretsOK struct {

	/*
	  In: Body
	*/
	Payload *models.ResponseSecretInfoList `json:"body,omitempty"`
}

// NewGetSecretsOK creates GetSecretsOK with default headers values
func NewGetSecretsOK() *GetSecretsOK {

	return &GetSecretsOK{}
}

// WithPayload adds the payload to the get secrets o k response
func (o *GetSecretsOK) WithPayload(payload *models.ResponseSecretInfoList) *GetSecretsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get secrets o k response
func (o *GetSecretsOK) SetPayload(payload *models.ResponseSecretInfoList) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetSecretsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// GetSecretsBadRequestCode is the HTTP code returned for type GetSecretsBadRequest
const GetSecretsBadRequestCode int = 400

/*
GetSecretsBadRequest Error

swagger:response getSecretsBadRequest
*/
type GetSecretsBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ResponseError `json:"body,omitempty"`
}

// NewGetSecretsBadRequest creates GetSecretsBadRequest with default headers values
func NewGetSecretsBadRequest() *GetSecretsBadRequest {

	return &GetSecretsBadRequest{}
}

// WithPayload adds the payload to the get secrets bad request response
func (o *GetSecretsBadRequest) WithPayload(payload *models.ResponseError) *GetSecretsBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get secrets bad request response
func (o *GetSecretsBadRequest) SetPayload(payload *models.ResponseError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetSecretsBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
