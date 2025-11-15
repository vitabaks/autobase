package xdocker

import (
	"context"
	"io"
	"postgresql-cluster-console/pkg/tracer"
	"strings"

	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/errdefs"
)

func (m *dockerManager) pullImage(ctx context.Context, dockerImage string) error {
	dockerImage = strings.TrimSpace(dockerImage)
	localLog := m.log.With().Str("cid", ctx.Value(tracer.CtxCidKey{}).(string)).Logger()

	inspectRes, _, err := m.cli.ImageInspectWithRaw(ctx, dockerImage)
	if err != nil {
		if !errdefs.IsNotFound(err) {
			localLog.Error().Err(err).Str("docker_image", dockerImage).Msg("failed to inspect docker image")
			return err
		}
	} else if inspectRes.ID != "" {
		localLog.Info().Str("docker_image", dockerImage).Msg("docker image already present locally")
		return nil
	}

	out, err := m.cli.ImagePull(ctx, dockerImage, image.PullOptions{})
	if err != nil {
		localLog.Error().Err(err).Str("docker_image", dockerImage).Msg("failed to pull docker image")
		return err
	}
	defer func(rc io.ReadCloser) {
		if cerr := rc.Close(); cerr != nil {
			localLog.Warn().Err(cerr).Msg("failed to close image_pull output")
		}
	}(out)

	_, _ = io.Copy(io.Discard, out)
	localLog.Info().Str("docker_image", dockerImage).Msg("docker image successfully pulled")

	return nil
}
