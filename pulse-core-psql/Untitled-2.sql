await sequelize.query(`
  WITH RECURSIVE tree AS (
    SELECT id, name, 1 AS relative_depth
    FROM nodes
    WHERE id = '96eb4434-42c5-4297-88e5-b96a415815d5'

    UNION ALL

    SELECT n.id, n.name, relative_depth + 1
    FROM nodes n
    JOIN n2n ON nodes.id = n2n."parentId"
    JOIN tree ON n2n."childId" = tree.id
    WHERE n2n."parentId" = tree.id
  )
  SELECT * FROM tree;
`)

-- grouping by parentId
await sequelize.query(`
  SELECT
    json_agg(
      jsonb_build_object('id', n.id)
      || jsonb_build_object('name', n.name)
      || jsonb_build_object('parentId', n2n."parentId")
    )::jsonb AS js
  FROM nodes n
  JOIN n2n ON n.id = n2n."childId"
  GROUP BY n2n."parentId"
`)

queryToGetAllAccessibleNodes = `
  SELECT nodes.id, nodes.name, nodes.type, roles_nodes.order
  FROM nodes
  JOIN roles_nodes
  ON nodes.id = roles_nodes."nodeId"
  JOIN roles
  ON roles.id = roles_nodes."roleId"
  WHERE roles.id = 'c04bfb71-9314-4a51-be72-480c3d7c82cf'
`

await sequelize.query(`
  WITH RECURSIVE nodes_from_parents AS (
    SELECT id, name, '{}'::uuid[] as parents, 0 as level
    FROM (${queryToGetAllAccessibleNodes}) AS c
    WHERE c.id NOT IN (SELECT "childId" FROM n2n)

  )
  SELECT *
  FROM nodes_from_parents
`)

  JOIN nodes x ON n2n."childId" = x.id


-- FIRST PART QUERY THAT WORKS EVEN IF YOU DON'T SELF JOIN
PART_recursionQueryTopDown = `
  WITH RECURSIVE nodes_from_parents AS (
    SELECT id, '{}'::uuid[] as parents, 0 as level
    FROM (${queryToGetAllAccessibleNodes}) AS c
    WHERE c.id NOT IN (SELECT "childId" FROM n2n)

    UNION ALL

    SELECT n2n_1."childId" as id, parents || n2n_1."parentId", level+1
    FROM nodes_from_parents AS p
    JOIN n2n as n2n_1
    ON n2n_1."parentId" = p.id
  )
`
STANDALONE_recursionQueryTopDown = `
  ${PART_recursionQueryTopDown}
  SELECT *
  FROM nodes_from_parents
`
await sequelize.query(STANDALONE_recursionQueryTopDown)
