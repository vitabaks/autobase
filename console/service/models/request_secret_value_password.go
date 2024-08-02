// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// RequestSecretValuePassword request secret value password
//
// swagger:model Request.SecretValue.Password
type RequestSecretValuePassword struct {

	// p a s s w o r d
	PASSWORD string `json:"PASSWORD,omitempty"`

	// u s e r n a m e
	USERNAME string `json:"USERNAME,omitempty"`
}

// Validate validates this request secret value password
func (m *RequestSecretValuePassword) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this request secret value password based on context it is used
func (m *RequestSecretValuePassword) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *RequestSecretValuePassword) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *RequestSecretValuePassword) UnmarshalBinary(b []byte) error {
	var res RequestSecretValuePassword
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
