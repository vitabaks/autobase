package environment

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/rs/zerolog"
	"postgesql-cluster-console/internal/controllers"
	"postgesql-cluster-console/internal/convert"
	"postgesql-cluster-console/internal/storage"
	"postgesql-cluster-console/pkg/tracer"
	"postgesql-cluster-console/restapi/operations/environment"
)

type postEnvironmentsHandler struct {
	db  storage.IStorage
	log zerolog.Logger
}

func NewPostEnvironmentsHandler(db storage.IStorage, log zerolog.Logger) environment.PostEnvironmentsHandler {
	return &postEnvironmentsHandler{
		db:  db,
		log: log,
	}
}

func (h *postEnvironmentsHandler) Handle(param environment.PostEnvironmentsParams) middleware.Responder {
	cid := param.HTTPRequest.Context().Value(tracer.CtxCidKey{}).(string)
	localLog := h.log.With().Str("cid", cid).Logger()
	checkEnv, err := h.db.GetEnvironmentByName(param.HTTPRequest.Context(), param.Body.Name)
	if err != nil {
		localLog.Warn().Err(err).Msg("failed to check environment name exists")
	} else if checkEnv != nil {
		return environment.NewPostEnvironmentsBadRequest().WithPayload(controllers.MakeErrorPayload(fmt.Errorf("The environment named %q already exists", param.Body.Name), controllers.BaseError))
	}
	env, err := h.db.CreateEnvironment(param.HTTPRequest.Context(), &storage.AddEnvironmentReq{
		Name:        param.Body.Name,
		Description: param.Body.Description,
	})
	if err != nil {
		return environment.NewPostEnvironmentsBadRequest().WithPayload(controllers.MakeErrorPayload(err, controllers.BaseError))
	}

	return environment.NewPostEnvironmentsOK().WithPayload(convert.EnvironmentToSwagger(env))
}