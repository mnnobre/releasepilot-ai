import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('ReleasePilot dashboard', () => {
  it('renders the release command center and its primary metrics', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Release command center' }),
    ).toBeInTheDocument()
    expect(screen.getByText('88%')).toBeInTheDocument()
    expect(screen.getByText('Ready with attention')).toBeInTheDocument()
  })

  it('refreshes the local release analysis', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Refresh analysis' }),
    )

    expect(
      screen.getByRole('button', { name: 'Analysis refreshed' }),
    ).toBeInTheDocument()
  })

  it('opens and closes the release report', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'View report' }))
    expect(
      screen.getByRole('dialog', { name: 'v2.8.4' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close report' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
