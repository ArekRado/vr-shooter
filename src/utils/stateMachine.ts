const wildcard = '*'

export const stateMachine = <State, TransitionNames, ExtraParams>({
  transitions,
  onStateChange,
}: {
  transitions: {
    name: TransitionNames
    from: State | typeof wildcard
    to: State
  }[]
  onStateChange?: (
    transition: {
      name: TransitionNames
      from: State | typeof wildcard
      to: State
    },
    extraParams: ExtraParams & { state: State },
  ) => void
}) => {
  const hasWildcard = transitions.find(({ from }) => from === wildcard)

  return ({
    state,
    transition,
    extraParams,
  }: {
    state: State
    transition: TransitionNames
    extraParams: ExtraParams
  }) => {
    let newState = transitions.find(
      ({ name, from }) => name === transition && from === state,
    )

    if (!newState && hasWildcard) {
      newState = transitions.find(
        ({ name, from }) => name === transition && from === wildcard,
      )
    }

    if (newState) {
      onStateChange?.(newState, { ...extraParams, state })
    } else {
      console.warn(`Illegal transition ${transition} from ${state}`)
    }

    return newState?.to
  }
}
