import * as React from 'react';

import appContext from '../../appContext';

import LinearTimelineView from './linearTimelineView';
import LoadingView from '../shared/loadingView';
import ErrorView from '../shared/errorView';

interface EntriesByTagContainerProps {
    tag: string;
}

interface EntriesByTagContainerState {
    isCompleted: boolean;
    tag: string;
    datasource: any;
    error: string | false;
}

class EntriesByTagContainer extends React.Component<EntriesByTagContainerProps, EntriesByTagContainerState> {
    static getDerivedStateFromProps(nextProps: EntriesByTagContainerProps, prevState: EntriesByTagContainerState) {
        if (nextProps.tag !== prevState.tag) {
            return {
                isCompleted: false,
                tag: nextProps.tag,
            };
        }

        return null;
    }

    constructor(props: EntriesByTagContainerProps, context: any) {
        super(props, context);

        this.state = {
            isCompleted: false,
            tag: props.tag,
            datasource: null,
            error: false,
        };
    }

    componentDidMount(): void {
        if (!this.state.isCompleted) {
            this.updateDatasource(this.state.tag);
        }
    }

    componentDidUpdate(prevProps: EntriesByTagContainerProps, prevState: EntriesByTagContainerState): void {
        this.componentDidMount();
    }

    render(): JSX.Element {
        if (this.state.error !== false) {
            return (
                <ErrorView message="An error occurred" />
            );
        }

        if (this.state.datasource === null) {
            return (
                <LoadingView />
            );
        }

        const isEditable = false; // (this.props.store.login.userLevel >= constants.UserLevels.Editor);

        return (
            <div>
                <h1>Entries By Tag: {this.state.tag}</h1>

                <LinearTimelineView datasource={this.state.datasource} datakey="entries" editable={isEditable} />
            </div>
        );
    }

    async updateDatasource(tag: string): Promise<void> {
        const pageService = appContext.get('pageService');

        try {
            const response = await pageService.getEntriesByTag(tag);

            this.setState({ isCompleted: true, datasource: response, error: false });
        }
        catch (err) {
            console.error(err);

            this.setState({ isCompleted: true, datasource: null, error: err });
        }
    }
}

export {
    EntriesByTagContainer as default,
    EntriesByTagContainerProps,
    EntriesByTagContainerState,
};