package dictionary

import (
	"github.com/go-openapi/runtime/middleware"
	"postgesql-cluster-console/internal/controllers"
	"postgesql-cluster-console/internal/convert"
	"postgesql-cluster-console/internal/storage"
	"postgesql-cluster-console/models"
	"postgesql-cluster-console/restapi/operations/dictionary"
)

type getDbExtensionsHandler struct {
	db storage.IStorage
}

func NewGetDbExtensionsHandler(db storage.IStorage) dictionary.GetDatabaseExtensionsHandler {
	return &getDbExtensionsHandler{
		db: db,
	}
}

func (h *getDbExtensionsHandler) Handle(param dictionary.GetDatabaseExtensionsParams) middleware.Responder {
	extensions, meta, err := h.db.GetExtensions(param.HTTPRequest.Context(), &storage.GetExtensionsReq{
		Type:            param.ExtensionType,
		PostgresVersion: param.PostgresVersion,
		Limit:           param.Limit,
		Offset:          param.Offset,
	})
	if err != nil {
		return dictionary.NewGetDatabaseExtensionsBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}

	return dictionary.NewGetDatabaseExtensionsOK().WithPayload(&models.ResponseDatabaseExtensions{
		Data: convert.DbExtensionsToSwagger(extensions),
		Meta: &models.MetaPagination{
			Count:  &meta.Count,
			Limit:  &meta.Limit,
			Offset: &meta.Offset,
		},
	})
}