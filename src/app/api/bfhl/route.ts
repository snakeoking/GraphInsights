import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body.data || [];

    const invalid_entries: string[] = [];
    const duplicate_edges: string[] = [];
    
    const seen_edges = new Set<string>();
    const parents = new Map<string, string>();
    const adj = new Map<string, string[]>();
    const all_nodes = new Set<string>();

    const undirected_adj = new Map<string, string[]>();

    const addUndirectedEdge = (u: string, v: string) => {
      if (!undirected_adj.has(u)) undirected_adj.set(u, []);
      if (!undirected_adj.has(v)) undirected_adj.set(v, []);
      undirected_adj.get(u)!.push(v);
      undirected_adj.get(v)!.push(u);
    };

    for (let i = 0; i < data.length; i++) {
      const originalStr = data[i];
      if (typeof originalStr !== 'string') {
        invalid_entries.push(String(originalStr));
        continue;
      }
      const str = originalStr.trim();
      
      const isValid = /^[A-Z]->[A-Z]$/.test(str) && str[0] !== str[3];
      if (!isValid) {
        invalid_entries.push(originalStr);
        continue;
      }

      if (seen_edges.has(str)) {
        duplicate_edges.push(originalStr);
        continue;
      }
      seen_edges.add(str);

      const u = str[0];
      const v = str[3];

      all_nodes.add(u);
      all_nodes.add(v);

      if (parents.has(v)) {
        // Multi-parent (Diamond): silently discard
        continue;
      }

      parents.set(v, u);
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u)!.push(v);
      
      addUndirectedEdge(u, v);
    }

    const roots: string[] = [];
    for (const node of all_nodes) {
      if (!parents.has(node)) {
        roots.push(node);
      }
    }

    roots.sort(); // Lexicographically smaller first for ties

    const hierarchies: any[] = [];
    const visited = new Set<string>();
    let total_trees = 0;
    let total_cycles = 0;

    const buildTree = (node: string): { tree: any, depth: number } => {
      visited.add(node);
      const tree: any = {};
      let max_depth = 1;
      
      const children = adj.get(node) || [];
      children.sort(); // Sorting children for deterministic output
      
      for (const child of children) {
        const { tree: childTree, depth: childDepth } = buildTree(child);
        tree[child] = childTree;
        max_depth = Math.max(max_depth, 1 + childDepth);
      }
      
      return { tree, depth: max_depth };
    };

    let largest_tree_root = "";
    let max_tree_depth = 0;

    for (const root of roots) {
      const { tree, depth } = buildTree(root);
      hierarchies.push({
        root,
        tree,
        depth
      });
      total_trees++;
      
      if (depth > max_tree_depth) {
        max_tree_depth = depth;
        largest_tree_root = root;
      } else if (depth === max_tree_depth && max_tree_depth > 0) {
        if (root < largest_tree_root || largest_tree_root === "") {
          largest_tree_root = root;
        }
      }
    }

    // Now find cycles
    for (const node of all_nodes) {
      if (!visited.has(node)) {
        // Unvisited node means it's part of a cyclic component
        const component: string[] = [];
        const queue: string[] = [node];
        visited.add(node);
        
        while (queue.length > 0) {
          const curr = queue.shift()!;
          component.push(curr);
          
          const neighbors = undirected_adj.get(curr) || [];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
        
        component.sort();
        const cycleRoot = component[0];
        hierarchies.push({
          root: cycleRoot,
          tree: {},
          has_cycle: true
        });
        total_cycles++;
      }
    }

    const response = NextResponse.json({
      user_id: "john_doe_01012000", // placeholder
      email_id: "john@example.edu", // placeholder
      college_roll_number: "123456", // placeholder
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary: {
        total_trees,
        total_cycles,
        largest_tree_root: largest_tree_root || null
      }
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
