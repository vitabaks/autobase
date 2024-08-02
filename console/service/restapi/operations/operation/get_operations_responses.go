// Code generated by go-swagger; DO NOT EDIT.

package operation

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"postgesql-cluster-console/models"
)

// GetOperationsOKCode is the HTTP code returned for type GetOperationsOK
const GetOperationsOKCode int = 200

/*
GetOperationsOK OK

swagger:response getOperationsOK
*/
type GetOperationsOK struct {

	/*
	  In: Body
	*/
	Payload *models.ResponseOperationsList `json:"body,omitempty"`
}

// NewGetOperationsOK creates GetOperationsOK with default headers values
func NewGetOperationsOK() *GetOperationsOK {

	return &GetOperationsOK{}
}

// WithPayload adds the payload to the get operations o k response
func (o *GetOperationsOK) WithPayload(payload *models.ResponseOperationsList) *GetOperationsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get operations o k response
func (o *GetOperationsOK) SetPayload(payload *models.ResponseOperationsList) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetOperationsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// GetOperationsBadRequestCode is the HTTP code returned for type GetOperationsBadRequest
const GetOperationsBadRequestCode int = 400

/*
GetOperationsBadRequest Error

swagger:response getOperationsBadRequest
*/
type GetOperationsBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ResponseError `json:"body,omitempty"`
}

// NewGetOperationsBadRequest creates GetOperationsBadRequest with default headers values
func NewGetOperationsBadRequest() *GetOperationsBadRequest {

	return &GetOperationsBadRequest{}
}

// WithPayload adds the payload to the get operations bad request response
func (o *GetOperationsBadRequest) WithPayload(payload *models.ResponseError) *GetOperationsBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the get operations bad request response
func (o *GetOperationsBadRequest) SetPayload(payload *models.ResponseError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *GetOperationsBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
