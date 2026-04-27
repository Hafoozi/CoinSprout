const parentKey = (userId:  string) => `cs_tutorial_parent_done_${userId}`
const childKey  = (childId: string) => `cs_tutorial_child_done_${childId}`

function get(key: string): boolean {
  try { return localStorage.getItem(key) === 'true' } catch { return false }
}
function put(key: string): void {
  try { localStorage.setItem(key, 'true') } catch {}
}
function del(key: string): void {
  try { localStorage.removeItem(key) } catch {}
}

export const isParentTutorialDone   = (userId:  string) => get(parentKey(userId))
export const markParentTutorialDone = (userId:  string) => put(parentKey(userId))
export const resetParentTutorial    = (userId:  string) => del(parentKey(userId))

export const isChildTutorialDone    = (childId: string) => get(childKey(childId))
export const markChildTutorialDone  = (childId: string) => put(childKey(childId))
export const resetChildTutorial     = (childId: string) => del(childKey(childId))
