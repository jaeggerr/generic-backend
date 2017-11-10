export interface Document {
  /**
   * Document’s “primary data”.
   * The members data and errors MUST NOT coexist in the same document.
   */
  data?: ResourceObject | ResourceObject[]
  /**
   * Array of error objects.
   * The members data and errors MUST NOT coexist in the same document.
   */
  errors?: object[]

  /**
   * Meta object that contains non-standard meta-information.
   */
  meta?: object

  /**
   * Object describing the server’s implementation.
   */
  jsonapi?: object

  /**
   * Links object related to the primary data.
   */
  links?: Links | PaginationLinks

  /**
   * Array of resource objects that are related to the primary data and / or each other(“included resources”).
   */
  included?: object[]
}

export interface LinkObject {
  related?: {
    /**
     * String containing the link’s URL
     */
    href: string
    /**
     * Meta object containing non-standard meta-information about the link.
     */
    meta: object
  }
}
export type LinksItem = LinkObject | string

export interface Links {
  /**
   * The link that generated the current response document.
   */
  self?: LinksItem
  related?: LinksItem
}

export interface PaginationLinks extends Links {
  /**
   * The first page of data
   */
  first: LinksItem
  /**
   * The last page of data
   */
  last: LinksItem
  /**
   * The previous page of data
   */
  prev: LinksItem
  /**
   * The next page of data
   */
  next: LinksItem
}

export interface Error {
  /**
   * Unique identifier for this particular occurrence of the problem
   */
  id?: string
  links?: Links & {
    /**
     * Link that leads to further details about this particular occurrence of the problem.
     */
    about: string
  }
  /**
   * Link that leads to further details about this particular occurrence of the problem.
   */
  about?: string
  /**
   * HTTP status code applicable to this problem, expressed as a string value.
   */
  status?: number
  /**
   * Application - specific error code, expressed as a string value.
   */
  code?: string
  /**
   * Short, human - readable summary of the problem that SHOULD NOT change from
   * occurrence to occurrence of the problem, except for purposes of localization.
   */
  title?: string
  /**
   * Human - readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
   */
  detail?: string
  /**
   * Object containing references to the source of the error
   */
  source?: {
    /**
     * JSON Pointer [RFC6901] to the associated entity in the request document
     * [e.g. '/data' for a primary data object, or '/data/attributes/title' for a specific attribute].
     */
    pointer?: string
    /**
     * String indicating which URI query parameter caused the error.
     */
    parameter?: string
  }
  /**
   * eta object containing non - standard meta - information about the error.
   */
  meta?: object
}

export interface ResourceObject {
  /**
   * The id member is not required when the resource object originates at the client and represents a new resource to be created on the server.
   */
  id?: string
  type: string
  /**
   * Attributes object representing some of the resource’s data.
   */
  attributes?: object
  /**
   * Relationships object describing relationships between the resource and other JSON API resources.
   */
  relationships?: {
    [key: string]: Relationships
  }
  /**
   * Links object containing links related to the resource.
   */
  links?: Links
  /**
   * Meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.
   */
  meta?: object
}

interface ResourceIdentifer {
  id: string
  type: string
  meta?: object
}

interface Relationships {
  links?: Links
  data?: null | ResourceIdentifer | ResourceIdentifer[]
  meta?: string
}
