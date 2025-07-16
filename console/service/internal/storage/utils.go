package storage

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"strings"
)

func QueryRowsToStruct[output any](
	ctx context.Context,
	pool *pgxpool.Pool,
	query string,
	args ...any,
) ([]output, error) {
	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByPos[output])
}

func QueryRowsToAddrStruct[output any](
	ctx context.Context,
	pool *pgxpool.Pool,
	query string,
	args ...any,
) ([]*output, error) {
	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToAddrOfStructByPos[output])
}

func QueryRowToStruct[output any](
	ctx context.Context,
	pool *pgxpool.Pool,
	query string,
	args ...any,
) (*output, error) {
	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	var res output
	res, err = pgx.CollectOneRow(rows, pgx.RowToStructByPos[output])
	if err != nil {
		return nil, err
	}

	return &res, nil
}

func QueryRowToScalar[scalar any](
	ctx context.Context,
	pool *pgxpool.Pool,
	query string,
	args ...any,
) (scalar, error) {
	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		var value scalar
		return value, err
	}

	return pgx.CollectOneRow(rows, pgx.RowTo[scalar])
}

func QueryRowToScalarAddr[scalar any](
	ctx context.Context,
	pool *pgxpool.Pool,
	query string,
	args ...any,
) (*scalar, error) {
	rows, err := pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectOneRow(rows, pgx.RowToAddrOf[scalar])
}

func OrderByConverter(sortByFromApi *string, defaultField string, convMap map[string]string) string {
	orderBy := strings.Builder{}
	if sortByFromApi != nil {
		sortByFields := strings.Split(*sortByFromApi, ",")
		for _, sortBy := range sortByFields {
			if len(sortBy) == 0 {
				continue
			}
			order := "asc"
			if sortBy[0] == '-' {
				order = "desc"
				sortBy = sortBy[1:]
			}
			tableField := convMap[sortBy]
			if len(tableField) != 0 {
				if orderBy.Len() != 0 {
					orderBy.WriteString(",")
				}
				orderBy.WriteString(tableField + " " + order)
			}
		}
	}
	if orderBy.Len() == 0 {
		return defaultField
	}

	return orderBy.String()
}
