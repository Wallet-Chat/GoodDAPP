import { useMemo } from 'react'
import { filter, get, includes, isArray, isEmpty } from 'lodash'

import uuid from '../../../lib/utils/uuid'
import Config from '../../../config/config'
import SimpleStore from '../../../lib/undux/SimpleStore'

export const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
}

export const emptyFeed = { type: 'empty', data: {} }
const defaultFilters = { includeInvites: true, categories: [] }

// the key should be always the same value.
// so we'll use WeakMap to keep item -> id linked
// 'createdDate' couldn't be used as the unique value
// as it's stringified an millisecomds (which are making)
// timestamps unique are lost
const itemKeyMap = new WeakMap()

export const keyExtractor = item => {
  const { id } = item

  if (id && String(id).length >= 60) {
    return id
  }

  if (!itemKeyMap.has(item)) {
    itemKeyMap.set(item, uuid())
  }

  return itemKeyMap.get(item)
}

export const useFeeds = (data, filters = {}) => {
  const store = SimpleStore.useStore()
  const loadAnimShown = store.get('feedLoadAnimShown')
  const { includeInvites = defaultFilters.includeInvites, categories = defaultFilters.categories } = filters

  return useMemo(() => {
    if (!isArray(data) || isEmpty(data)) {
      return loadAnimShown ? [] : [emptyFeed]
    }

    const typesArray = categories

    if (!includeInvites || !Config.enableInvites) {
      typesArray.push('invite')
    }

    return filter(data, item => !includes(typesArray, get(item, 'type')))
  }, [data, includeInvites, categories])
}
