// Code generated by go-swagger; DO NOT EDIT.

package dictionary

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// NewGetDatabaseExtensionsParams creates a new GetDatabaseExtensionsParams object
// with the default values initialized.
func NewGetDatabaseExtensionsParams() GetDatabaseExtensionsParams {

	var (
		// initialize parameters with default values

		extensionTypeDefault = string("all")
	)

	return GetDatabaseExtensionsParams{
		ExtensionType: &extensionTypeDefault,
	}
}

// GetDatabaseExtensionsParams contains all the bound params for the get database extensions operation
// typically these are obtained from a http.Request
//
// swagger:parameters GetDatabaseExtensions
type GetDatabaseExtensionsParams struct {

	// HTTP Request Object
	HTTPRequest *http.Request `json:"-"`

	/*
	  In: query
	  Default: "all"
	*/
	ExtensionType *string
	/*
	  In: query
	*/
	Limit *int64
	/*
	  In: query
	*/
	Offset *int64
	/*
	  In: query
	*/
	PostgresVersion *string
}

// BindRequest both binds and validates a request, it assumes that complex things implement a Validatable(strfmt.Registry) error interface
// for simple values it will use straight method calls.
//
// To ensure default values, the struct must have been initialized with NewGetDatabaseExtensionsParams() beforehand.
func (o *GetDatabaseExtensionsParams) BindRequest(r *http.Request, route *middleware.MatchedRoute) error {
	var res []error

	o.HTTPRequest = r

	qs := runtime.Values(r.URL.Query())

	qExtensionType, qhkExtensionType, _ := qs.GetOK("extension_type")
	if err := o.bindExtensionType(qExtensionType, qhkExtensionType, route.Formats); err != nil {
		res = append(res, err)
	}

	qLimit, qhkLimit, _ := qs.GetOK("limit")
	if err := o.bindLimit(qLimit, qhkLimit, route.Formats); err != nil {
		res = append(res, err)
	}

	qOffset, qhkOffset, _ := qs.GetOK("offset")
	if err := o.bindOffset(qOffset, qhkOffset, route.Formats); err != nil {
		res = append(res, err)
	}

	qPostgresVersion, qhkPostgresVersion, _ := qs.GetOK("postgres_version")
	if err := o.bindPostgresVersion(qPostgresVersion, qhkPostgresVersion, route.Formats); err != nil {
		res = append(res, err)
	}
	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

// bindExtensionType binds and validates parameter ExtensionType from query.
func (o *GetDatabaseExtensionsParams) bindExtensionType(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		// Default values have been previously initialized by NewGetDatabaseExtensionsParams()
		return nil
	}
	o.ExtensionType = &raw

	if err := o.validateExtensionType(formats); err != nil {
		return err
	}

	return nil
}

// validateExtensionType carries on validations for parameter ExtensionType
func (o *GetDatabaseExtensionsParams) validateExtensionType(formats strfmt.Registry) error {

	if err := validate.EnumCase("extension_type", "query", *o.ExtensionType, []interface{}{"all", "contrib", "third_party"}, true); err != nil {
		return err
	}

	return nil
}

// bindLimit binds and validates parameter Limit from query.
func (o *GetDatabaseExtensionsParams) bindLimit(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}

	value, err := swag.ConvertInt64(raw)
	if err != nil {
		return errors.InvalidType("limit", "query", "int64", raw)
	}
	o.Limit = &value

	return nil
}

// bindOffset binds and validates parameter Offset from query.
func (o *GetDatabaseExtensionsParams) bindOffset(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}

	value, err := swag.ConvertInt64(raw)
	if err != nil {
		return errors.InvalidType("offset", "query", "int64", raw)
	}
	o.Offset = &value

	return nil
}

// bindPostgresVersion binds and validates parameter PostgresVersion from query.
func (o *GetDatabaseExtensionsParams) bindPostgresVersion(rawData []string, hasKey bool, formats strfmt.Registry) error {
	var raw string
	if len(rawData) > 0 {
		raw = rawData[len(rawData)-1]
	}

	// Required: false
	// AllowEmptyValue: false

	if raw == "" { // empty values pass all other validations
		return nil
	}
	o.PostgresVersion = &raw

	return nil
}
